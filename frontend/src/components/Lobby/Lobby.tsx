import React from 'react';
import { Button, Grid, Card, Input, InputLabel, Typography, FormControl } from '@material-ui/core';
import { Public } from '@material-ui/icons';

import { useStyles } from './style';

interface IProps {
  roomName: string | null;
  userName: string | null;
  handleChangeUserName: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleChangeRoomName: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleCreateRoom: (event: React.FormEvent) => void;
}

const Lobby: React.FC<IProps> = ({
  roomName,
  userName,
  handleChangeRoomName,
  handleChangeUserName,
  handleCreateRoom,
}) => {
  const classes = useStyles();
  const [disabled, setDisabled] = React.useState<boolean>(true);

  React.useEffect(() => {
    if ((roomName?.length ?? 0) > 0 && (userName?.length ?? 0) > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [roomName, userName]);

  return (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      <Card className={classes.cardForm}>
        <form className={classes.formContainer} onSubmit={handleCreateRoom}>
          <Typography variant="h5" className={classes.title}>
            Create room
          </Typography>
          <Public className={classes.iconSize} color="primary" />
          <FormControl>
            <InputLabel>Room Name:</InputLabel>
            <Input
              id="room-name"
              onChange={handleChangeRoomName}
              value={roomName}
              aria-describedby="Room Name"
              name="room-name"
            />
          </FormControl>
          <FormControl>
            <InputLabel>Name</InputLabel>
            <Input
              id="user-name"
              onChange={handleChangeUserName}
              value={userName}
              aria-describedby="Name"
              name="user-name"
            />
          </FormControl>
          <FormControl>
            <Button type="submit" disabled={disabled} variant="contained" color="primary">
              Create
            </Button>
          </FormControl>
        </form>
      </Card>
    </Grid>
  );
};

export default Lobby;
