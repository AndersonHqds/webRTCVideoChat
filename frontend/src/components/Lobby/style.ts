import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100vh',
    },
    cardForm: {
      width: 300,
    },
    iconSize: {
      fontSize: 60,
    },
    formContainer: {
      '& > *': {
        margin: theme.spacing(1),
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#FFF',
      padding: 50,
    },
    title: {
      color: '#c3c3c3',
    },
  }),
);
