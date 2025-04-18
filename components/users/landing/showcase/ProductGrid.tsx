import React from "react";
import { Grid, Box, Typography, IconButton } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { BaseButton } from "../../buttons/BaseButton";
import ProductCard from "../../products/ProductCard";
import Link from "next/link";
import { getAllProducts } from "@/app/actions/products/action";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function ProductGrid() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const productsResponse = userId ? await getAllProducts(userId) : await getAllProducts();
  const visibleProducts =3;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        SHOP BY PRODUCTS
      </Typography>

      <Grid container spacing={{ xs: 1, sm: 3 }} justifyContent="center">
        {productsResponse.products?.slice(0, visibleProducts).map((product: any) => (
          <Grid item xs={10} sm={6} md={3} key={product.id}>
            <ProductCard
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store?.name || "",
                storeId: product.storeId,
                category: product.category || "N/A",
                image: product.variants?.[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
              userId={userId}
            />
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
        <Link href="/products" passHref>
          <BaseButton>View All</BaseButton>
        </Link>
      </Box>
    </Box>
  );
}