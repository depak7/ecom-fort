"use client";

import { Grid, Box, Typography, IconButton } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import React, { useState } from "react";

import { BaseButton } from "../../buttons/BaseButton";
import Link from "next/link";



interface Store {
  id: number;
  name: string;
  logo: string | StaticImageData;
  location: string;
  description: string;
}

interface IProps {
  stores: Store[];
}

 

export default function StoreGrid({stores}:IProps) {

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
          .map((store, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
             <Box
                sx={{
                  overflow: "hidden",
                  position: "relative",
                  width: "280px", 
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                 
                }}
              >
                <Image
                  src={store.logo || ""}
                  alt={store.name}
                  layout="fill"
                  objectFit="contain" 
                />
              </Box>
                <Box display={"flex"} gap={1} justifyContent={"center"} sx={{ border:"1px solid"}}  >
                  <Typography variant="body1">
                    {store.name},
                  </Typography>
                  <Typography  variant="body1">
                    {store.location}
                  </Typography>
                </Box>
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
