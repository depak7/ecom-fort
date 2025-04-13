"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,

  styled,
  Box,
  useTheme,
  useMediaQuery,
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
  const theme=useTheme();
  const isMobile=useMediaQuery(theme.breakpoints.down("sm"))

  const handleAddProductClick = () => {
    router.push('/merchant/addproduct');
  };

  return (
    <AppBarStyled position="sticky">
      <Toolbar>
        <Typography
          variant={isMobile?"body1":"h6"}
          fontWeight={700}
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {storeName}
        </Typography>
        <Box gap={2}>
        
          <BaseButton customSize="small" onClick={handleAddProductClick}>Add Products</BaseButton>
        </Box>
      </Toolbar>
    </AppBarStyled>
  );
}
