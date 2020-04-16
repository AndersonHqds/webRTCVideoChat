import React from 'react';
import {} from '@material-ui/core';

// import { Container } from './styles';

interface IProps {
  userName: string;
  stream: any;
}

const Participant: React.FC<IProps> = ({ userName, stream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, []);

  return (
    <React.Fragment>
      <video style={{ width: '100%' }} ref={videoRef} autoPlay />
    </React.Fragment>
  );
};

export default Participant;
