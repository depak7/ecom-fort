"use client"

import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  width?: string | number;
  customSize?: 'small' | 'medium' | 'large';
  customMargin?: string | number;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export  const BaseButton = styled(Button)<CustomButtonProps>(({ theme, width, customSize, customMargin, mt, mb, ml, mr }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  width: width,
  margin: customMargin,
  marginTop: mt,
  marginRight: mr,
  marginBottom: mb,
  marginLeft: ml,
  padding: customSize === 'small' ? '6px 10px' : customSize === 'large' ? '12px 32px' : '8px 24px',
  fontSize: customSize === 'small' ? '15px' : customSize === 'large' ? '1.125rem' : '1rem',
  '&:hover': {
    backgroundColor: theme.palette.grey[800],
  },
}));

