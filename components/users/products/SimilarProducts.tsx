"use client";

import { Box, Grid, IconButton, Typography } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

import ProductCard from "@/components/users/products/ProductCard";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    store: string;
    storeId?: string;
    image: string;
  }[];
}

export default function SimilarProducts({ product }: ProductProps) {
  const products = product;
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
        {products && products
          ?.slice(currentIndex, currentIndex + visibleProducts)
          ?.map((product, index) => (
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
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{ color: "black" }}
        >
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
