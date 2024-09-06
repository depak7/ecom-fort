import React from "react";

import { Box, Typography, Grid, IconButton } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

import ProductCard from "@/components/users/products/ProductCard";
import { getAllProducts } from "../actions/products/action";



export default async function () {
  const products = await getAllProducts();

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography
        variant="h6"
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
          mb: 2
        }}
      >
        <Typography variant="body1" component="h6" fontWeight="bold">
          SHOP OUR PRODUCTS
        </Typography>
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Filters</Typography>
            <IconButton sx={{ color: "black" }} aria-label="filter">
              <TuneOutlinedIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Sort By</Typography>
            <IconButton sx={{ color: "black" }} aria-label="sort">
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products.products?.map((product) => (
          <Grid item xs={12} sm={6} md={3} xl={3} key={product.id}>
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(), 
                store: product.store.name,
                storeId:product.storeId,
                category:"shirt",
                image: product.variants[0]?.variantImage || "", 
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
