import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import socketIO from 'socket.io-client';

import Participant from '../Participant';

import webRTC from '../../helpers/webrtc';
import { useStyles } from './style';

interface IProps {
  userName: string;
  roomName: string;
  handleLogout: (event: React.MouseEvent) => void;
}

const Room: React.FC<IProps> = ({ userName, roomName, handleLogout }) => {
  const pc = React.useRef<RTCPeerConnection>(
    new webRTC.peerConnection({
      iceServers: [
        {
          urls: 'stun:stun.services.mozilla.com',
          username: 'somename',
          credential: 'somecredential',
        },
      ],
    }),
  );
  const socket = React.useRef<any>(null);
  const answersFrom = React.useRef<string[]>([]);
  const lastId = React.useRef<string | null>(null);
  const [users, setUsers] = React.useState<object[]>([]);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = React.useState<any[]>([]);
  const classes = useStyles();

  const createOffer = async (id: string) => {
    try {
      if (pc.current) {
        const offer = await pc.current.createOffer();
        await pc.current?.setLocalDescription(new webRTC.sessionDescription(offer));
        if (socket.current) {
          console.log('###### Making offer to ' + id);
          socket.current.emit('make-offer', {
            offer: offer,
            to: id,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    socket.current = socketIO('http://localhost:5000', { query: { roomName: roomName, userName: userName } });
    socket.current.on('add-users', (data: any) => {
      console.log(`My id: ${socket.current.id}`);
      console.log(data.users);

      if (data.users[0]!== socket.current.id) {
        setUsers((prevUsers: any[]) => [...prevUsers, { ...data.users[0] }]);
      }
      
      data.users.forEach((id: string) => {
        if(id === socket.current.id) return;
        if (!answersFrom.current.includes(id)) {
          console.log(answersFrom.current, !answersFrom.current[data.socket], "59");
          createOffer(id)
        }
      });
    });

    socket.current.on('remove-user', (id: string) => {
      setUsers((prevUsers: any[]) => prevUsers.filter((user) => user.id !== id));
    });

    socket.current.on('offer-made', async (data: any) => {
      if (pc.current) {
        await pc.current.setRemoteDescription(new webRTC.sessionDescription(data.offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(new webRTC.sessionDescription(answer));
        console.log("###### Offer made from " + data.socket);
        if (socket.current) {
          console.log("###### Making answer to " + data.socket);
          socket.current.emit('make-answer', {
            answer,
            to: data.socket,
          });
        }
      }
    });

    socket.current.on('answer-made', async (data: any) => {
      if (pc.current) {
        lastId.current = data.socket;
        console.log("####### Answer made to " + data.socket);
        await pc.current.setRemoteDescription(new webRTC.sessionDescription(data.answer));
        console.log(answersFrom.current, !answersFrom.current[data.socket])
        if (!answersFrom.current.includes(data.socket)) {
          createOffer(data.socket);
          answersFrom.current.push(data.socket);
        }
      }
    });

    navigator.getUserMedia(
      { video: true, audio: true },
      (stream: MediaStream) => {
        setStream(stream);
        stream.getTracks().forEach((track) => {
          console.log(track);
          pc.current.addTrack(track, stream);
        });
      },
      (error) => console.error('Room 41 error', error),
    );

    pc.current.ontrack = function (obj: any) {
      console.log(obj.streams[0]);
      const streams = remoteStreams.filter(stream => stream.stream.id !== obj.streams[0].id);
      setRemoteStreams((prevStream: any[]) => [...streams, { stream: obj.streams[0] }]);
    };
  }, []);

  return (
    <Grid container spacing={2} className={classes.gridContainer}>
      <Grid item xs={4} style={{ background: '#FFF' }}>
        <Typography variant="h4">Users</Typography>
        {remoteStreams &&
          remoteStreams.map((stream, index) => <Participant key={index} userName={''} stream={stream.stream} />)}
      </Grid>
      <Grid item xs={8} style={{ background: '#FFF' }}>
        {stream && <Participant userName={userName} stream={stream} />}
      </Grid>
    </Grid>
  );
};

export default Room;
