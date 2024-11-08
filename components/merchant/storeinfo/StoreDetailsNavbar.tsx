"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,

  styled,
  Box,
} from "@mui/material";
import { BaseButton } from "@/components/users/buttons/BaseButton";
import { useRouter } from 'next/navigation';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));



interface StoreDetailsNavBarProps {
  storeName: string;
}

export default function StoreDetailsNavBar({ storeName }: StoreDetailsNavBarProps) {
  const router = useRouter();

  const handleAddProductClick = () => {
    router.push('/merchant/addproduct');
  };

  return (
    <AppBarStyled position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={700}
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {storeName}
        </Typography>
        <Box gap={2}>
        
          <BaseButton onClick={handleAddProductClick}>Add Products</BaseButton>
        </Box>
      </Toolbar>
    </AppBarStyled>
  );
}
