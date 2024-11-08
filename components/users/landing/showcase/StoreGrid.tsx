"use client"

import { Grid, Box, Typography, IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import React, { useState } from "react";
import Link from "next/link";
import StoreCard from "../../stores/StoreCard";
import { BaseButton } from "../../buttons/BaseButton";

interface Store {
  id: string;
  name: string;
  logo: string | null;
  city: string;
  address:string;
  description: string;
}

interface StoreGridProps {
  stores: Store[]; // Expecting an array of stores
}

export default function StoreGrid({ stores }: StoreGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleStores = 3;

  const handleNext = () => {
    if (currentIndex < stores.length - visibleStores) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SHOP BY STORES
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {stores
          .slice(currentIndex, currentIndex + visibleStores)
          .map((store) => (
            <Grid item xs={12} sm={6} md={3} key={store.id}>
              <StoreCard store={store} />
            </Grid>
          ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{ color: "black" }}
        >
          <ArrowBackIos />
        </IconButton>
        <Link href="/stores" passHref>
          <BaseButton>View All</BaseButton>
        </Link>
        <IconButton
          onClick={handleNext}
          disabled={currentIndex >= stores.length - visibleStores}
          sx={{ color: "black" }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
}
