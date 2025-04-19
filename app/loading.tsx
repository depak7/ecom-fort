import React from 'react';
import { Box } from '@mui/material';

const LoadingAnimation: React.FC = () => {
    // Pick a random number between 1 and 4 (inclusive)
    const randomIndex = React.useMemo(() => Math.floor(Math.random() * 4) + 1, []);
    console.log(randomIndex)
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '50%', 
          height: '40%', 
          maxHeight: '80vh', 
        }}
      >
           <source src={`/Ani-${randomIndex}.webm`} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default LoadingAnimation;
