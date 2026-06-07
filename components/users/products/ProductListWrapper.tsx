'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import SortProducts, { PRODUCT_SORT_OPTIONS } from './SortProducts';
import BrowseToolbar from '@/components/users/discovery/BrowseToolbar';
import { useLocation } from '@/components/users/location/LocationProvider';

interface ProductListWrapperProps {
  initialProducts: any[];
  userId?: string;
}

const ProductListWrapper = ({ initialProducts, userId }: ProductListWrapperProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity, isHydrated } = useLocation();

  const fetchProducts = useCallback(async (sortBy = 'new-arrivals') => {
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (selectedCity) params.set('city', selectedCity);
      const res = await fetch(`/api/sort?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (isHydrated) fetchProducts('new-arrivals');
  }, [isHydrated, selectedCity, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.store?.name?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleSort = async (sortBy: string) => {
    await fetchProducts(sortBy);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <BrowseToolbar
        title="Products"
        subtitle="Shop from stores in your city"
        searchPlaceholder="Search products by name, category, or store…"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SortProducts
            label="Sort products"
            options={PRODUCT_SORT_OPTIONS}
            defaultValue="new-arrivals"
            onSortChange={handleSort}
          />
        </Box>
      </BrowseToolbar>

      <Box sx={{ maxWidth: 1200, margin: 'auto', px: 2 }}>
        {filteredProducts.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery.trim()
                ? 'Try a different search term or clear your city filter.'
                : selectedCity
                  ? `No products from stores in ${selectedCity} yet.`
                  : 'No products available at the moment.'}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </Typography>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      store: product.store.name,
                      storeId: product.storeId,
                      productImage: product.productImage,
                      category: product.category || 'General',
                      image: product.variants[0]?.variantImage || '',
                    }}
                    isWishlisted={product.isWishlisted || false}
                    userId={userId}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProductListWrapper;
