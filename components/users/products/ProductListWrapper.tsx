'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import SortProducts from './SortProducts';

interface ProductListWrapperProps {
  initialProducts: any[];
  userId?: string;
}

const ProductListWrapper = ({ initialProducts, userId }: ProductListWrapperProps) => {
  const [products, setProducts] = useState(initialProducts);

  const handleSort = async (sortBy: string) => {
    try {
      const res = await fetch(`/api/sort?sort=${sortBy}`);
      const data = await res.json();
   console.log(data)
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Sorting failed:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography  variant='subtitle2' fontWeight={700}>SHOP OUR PRODUCTS</Typography>
        <SortProducts onSortChange={handleSort} />
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} xl={3} key={product.id}>
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                store: product.store.name,
                storeId: product.storeId,
                productImage:product.productImage,
                category: product.category || "shirt",
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
              userId={userId}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductListWrapper;