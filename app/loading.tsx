import React from 'react';
import { Box } from '@mui/material';

const LoadingAnimation: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        <source src="/Animation - 1725127559887.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default LoadingAnimation;
