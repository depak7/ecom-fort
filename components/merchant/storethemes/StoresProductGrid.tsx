"use client"

import { useState, useEffect } from "react";
import { getProductsByStoreId } from "@/app/actions/products/action";
import ProductCard from "@/components/users/products/ProductCard";
import { Box, Grid, CircularProgress } from "@mui/material";

export default function StoresProductGrid({
  storeId,
  sort,
  userId
}: {
  storeId: string;
  sort: string;
  userId:string | null
}) {
  const [products, setProducts] = useState<any[]>([]); // Store the products
  const [loading, setLoading] = useState<boolean>(true);
  // Loading state
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if(userId)
        {
          response=await getProductsByStoreId(storeId,sort,userId);
        }
        else{
        response=await getProductsByStoreId(storeId, sort);
        }
       setProducts(response.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId, sort]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} p={2}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={3} xl={3} key={product.id}>
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store.name,
                storeId: product.storeId,
                category: product.category || "",
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
