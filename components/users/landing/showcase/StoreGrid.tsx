"use client"

import { Grid, Box, Typography, IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
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
  const [visibleStores, setVisibleStores] = useState(3);

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) { // md breakpoint
        setVisibleStores(2);
      } else {
        setVisibleStores(3);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        SHOP BY STORES
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {stores
          .slice(currentIndex, currentIndex + visibleStores)
          .map((store) => (
            <Grid item xs={10} sm={6} md={3} key={store.id}>
              <StoreCard store={store} />
            </Grid>
            
          ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Link href="/stores" passHref>
          <BaseButton>View All</BaseButton>
        </Link>
      </Box>
    </Box>
  );
}
