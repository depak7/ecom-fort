import React from "react";
import { Box } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllProducts } from "../actions/products/action";
import ProductListWrapper from "@/components/users/products/ProductListWrapper";

export default async function ProductList() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const products = userId ? await getAllProducts(userId) : await getAllProducts();

  const serializedProducts =
    products.products?.map((product) => ({
      ...product,
      price: product.price.toString(),
      variants: product.variants.map((variant) => ({ ...variant })),
    })) || [];

  return (
    <Box>
      <ProductListWrapper initialProducts={serializedProducts} userId={userId} />
    </Box>
  );
}
