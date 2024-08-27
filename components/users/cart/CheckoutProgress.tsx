"use client"

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { usePathname } from "next/navigation";

const CheckoutProgress = () => {
  const pathname = usePathname();

  const isMyBag = pathname === "/cart";
  const isAddress = pathname === "/cart/address";
  const isPayment = pathname === "/cart/address/payment";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 800,
        margin: "auto",
        mb: 4,
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight={isMyBag ? "bold" : "normal"}
        color={isMyBag ? "text.primary" : "text.secondary"}
      >
        My Bag
      </Typography>
      <Divider sx={{ flexGrow: 1, mx: 1 }} />
      <Typography 
        variant="h6" 
        fontWeight={isAddress ? "bold" : "normal"}
        color={isAddress ? "text.primary" : "text.secondary"}
      >
        Address
      </Typography>
      <Divider sx={{ flexGrow: 1, mx: 1 }} />
      <Typography 
        variant="h6"  
        fontWeight={isPayment ? "bold" : "normal"}
        color={isPayment ? "text.primary" : "text.secondary"}
      >
        Payment
      </Typography>
    </Box>
  );
};

export default CheckoutProgress;