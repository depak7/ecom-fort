import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Image from "next/image";

import shirt from "@/components/assets/users/shirt.png";
import sneakers from "@/components/assets/users/sneaker.png";
import hoodies from "@/components/assets/users/hoodies.png";
import trousers from "@/components/assets/users/trousers.png";
import sweatshirt from "@/components/assets/users/sweatshirt.png";
import tshirts from "@/components/assets/users/t-shirt.png";
import { BaseButton } from "@/components/users/buttons/BaseButton";

const categories = [
  { name: "SHIRTS", image: shirt },
  { name: "SNEAKERS", image: sneakers },
  { name: "HOODIES", image: hoodies },
  { name: "TROUSERS", image: trousers },
  { name: "SWEATSHIRT", image: sweatshirt },
  { name: "T-SHIRTS", image: tshirts },
];

export default function StoreCategories() {
  return (
    <Box sx={{ bgcolor: "#E2E2E2", p: 4 }}>
      <Typography variant="h6" align="center" fontWeight={700} gutterBottom>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Box
              sx={{
                position: "relative",
                height: 30,
                paddingTop: "100%",
                overflow: "inherit",
                borderRadius: 2,
              }}
            >
              <Image src={category.image} alt={category.name} fill />
              <Typography
                variant="body1"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 40,
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
