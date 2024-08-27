"use client";


import { Box, Grid, IconButton, Typography } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

import product1 from "@/components/assets/users/p1.png";
import product2 from "@/components/assets/users/p2.png";
import product3 from "@/components/assets/users/p3.png";
import product4 from "@/components/assets/users/p4.png";
import ProductCard from "@/components/users/products/ProductCard";
import { useState } from "react";

export default function SimilarProducts() {
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleProducts = 4;

  const handleNext = () => {
    if (currentIndex < products.length - visibleProducts) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
 
      <Box>
        <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 4, mb: 2 }}>
          Similar Products
        </Typography>
        <Grid container spacing={3}>
          {products.slice(currentIndex, currentIndex + visibleProducts).map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
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
          <IconButton onClick={handlePrev} disabled={currentIndex === 0} sx={{ color: "black" }}>
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={currentIndex >= products.length - visibleProducts}
            sx={{ color: "black" }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>

  );
}
