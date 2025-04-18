import React from "react";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllProducts } from "../actions/products/action";
import ProductListWrapper from "@/components/users/products/ProductListWrapper";


export default async function ProductList() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const products = userId ? await getAllProducts(userId) : await getAllProducts();

  // Convert Decimal values to strings for client-side serialization
  const serializedProducts = products.products?.map(product => ({
    ...product,
    price: product.price.toString(),
    variants: product.variants.map(variant => ({
      ...variant
    }))
  })) || [];

  return (
    <Box sx={{ maxWidth: 1600, margin: "auto", padding: 2 }}>
      <Typography
        variant={"body2"}
        component="h1"
        gutterBottom
        align="center"
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        PUT YOUR BEST FOOT FORWARD WITH OUR LATEST COLLECTION!
      </Typography>

      <ProductListWrapper
        initialProducts={serializedProducts} 
        userId={userId}
      />
    </Box>
  );
}