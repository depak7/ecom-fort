"use client";

import React from "react";

import {
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

import product1 from "@/components/assets/users/p1.png";
import product2 from "@/components/assets/users/p2.png";
import product3 from "@/components/assets/users/p3.png";
import product4 from "@/components/assets/users/p4.png";
import ProductCard from "../ProductCard";

const products = [
  {
    id: 1,
    name: "Nike Dunk Low Retro",
    category: "Men's Shoes",
    price: "8,695.00",
    store: "BrandMan,Coimbatore",
    image: product2,
  },
  {
    id: 2,
    name: "Jordan Flight Essentials",
    category: "Men's Printed T-Shirt",
    store: "Snipes,Coimbatore",
    price: "2,595.00",
    image: product1,
  },
  {
    id: 3,
    name: "Denim : Faded Green",
    category: "Denim Shirts",
    store: "Hustler's Club,Coimbatore",
    price: "2,595.00",
    image: product3,
  },
  {
    id: 4,
    name: "Wolverine : Weapon X",
    category: "Men's Low Top Sneakers",
    store: "Crocodile,Coimbatore",
    price: "3,695.00",
    image: product4,
  },
];

export default function AvailableProducts() {
 

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        PUT YOUR BEST FOOT FORWARD WITH OUR LATEST COLLECTION!
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          SHOP OUR PRODUCTS
        </Typography>
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Filters</Typography>
            <IconButton sx={{ color: "black" }} aria-label="filter">
              <TuneOutlinedIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Sort By</Typography>
            <IconButton sx={{ color: "black" }} aria-label="sort">
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
      {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard product={product}  /> 
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
