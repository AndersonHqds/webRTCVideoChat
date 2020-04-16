import React from 'react';

import Lobby from '../Lobby/Lobby';
import Room from '../Room/Room';

const WebRTCVideoChat = () => {
  const [roomName, setRoomName] = React.useState<string>('Silva');
  const [userName, setUserName] = React.useState<string>('Anderson');
  const [readyToChat, setReadyToChat] = React.useState<boolean>(true);

  const onChangeUserName = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUserName(event.target.value);
  }, []);

  const onChangeRoomName = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRoomName(event.target.value);
  }, []);

  const handleCreateRoom = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      console.log(userName, roomName);
      setReadyToChat(true);
    },
    [userName, roomName],
  );

  const onLogout = () => {
    setReadyToChat(false);
  };

  return readyToChat ? (
    <Room userName={userName} roomName={roomName} handleLogout={onLogout} />
  ) : (
    <Lobby
      handleCreateRoom={handleCreateRoom}
      handleChangeUserName={onChangeUserName}
      handleChangeRoomName={onChangeRoomName}
      roomName={roomName}
      userName={userName}
    />
  );
};

export default WebRTCVideoChat;
