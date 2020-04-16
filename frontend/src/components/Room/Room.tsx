import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import socketIO from 'socket.io-client';

import Participant from '../Participant';

import webRTC from '../../helpers/webrtc';
import { useStyles } from './style';

// import { Container } from './styles';

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
  const answersFrom = React.useRef<any[]>([]);
  const lastId = React.useRef<string | null>(null);
  const [users, setUsers] = React.useState<any[]>([]);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = React.useState<any[]>([]);
  const classes = useStyles();

  const createOffer = async (id: string) => {
    try {
      if (pc.current) {
        const offer = await pc.current.createOffer();
        await pc.current?.setLocalDescription(new webRTC.sessionDescription(offer));
        if (socket.current) {
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

      if (data.users[0].id !== socket.current.id) {
        setUsers((prevUsers: any[]) => [...prevUsers, { ...data.users[0] }]);
      }

      createOffer(data.users[0].id);
    });

    socket.current.on('remove-user', (id: string) => {
      setUsers((prevUsers: any[]) => prevUsers.filter((user) => user.id !== id));
    });

    socket.current.on('offer-made', async (data: any) => {
      if (pc.current) {
        await pc.current.setRemoteDescription(new webRTC.sessionDescription(data.offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(new webRTC.sessionDescription(answer));
        if (socket.current) {
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
        await pc.current.setRemoteDescription(new webRTC.sessionDescription(data.answer));
        if (!answersFrom.current[data.socket]) {
          createOffer(data.socket);
          answersFrom.current[data.socket] = true;
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
      //console.log(lastId.current);
      //console.log(users);
      //const user = users.filter((user) => user.id === lastId.current)[0];
      //console.log(user);
      // if (user) {
      //   setRemoteStreams((prevStream: any[]) => [
      //     ...prevStream,
      //     { stream: obj.streams[0], id: user.id, name: user.name },
      //   ]);
      // }
      setRemoteStreams((prevStream: any[]) => [...prevStream, { stream: obj.streams[0] }]);
    };
  }, []);

  return (
    <Grid container spacing={2} className={classes.gridContainer}>
      <Grid item xs={4} style={{ background: '#FFF' }}>
        <Typography variant="h4">Users</Typography>
        {console.log(users)}
        {/* {users.map((user) => (
          <Button key={user.id} onClick={() => createOffer(user.id)}>
            {user.name}
          </Button>
        ))} */}
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
