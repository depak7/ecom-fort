"use client";

import { useState, useEffect } from 'react';
import { getStoreById } from "@/app/actions/store/action";
import { Box, Typography } from "@mui/material";
import StoreDescriptionCard from "@/components/merchant/StoreDescriptionCard";

interface Store {
  address: string;
  id: string;
  name: string;
  logo: string;
  bannerImage: string | null;
  description: string;
  offerDescription: string | null;
  city: string;
  mapLink: string;
  ownerId: string;
}

export default function StorePage() {
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStore() {
      try {
        const result = await getStoreById("0ad8d17b-6b88-4b4d-a13c-584a6e280a04");
        if (result.success && result.store) {
          setStore(result.store);
        } else {
          setError("Error loading store details");
        }
      } catch (err) {
        setError("An error occurred while fetching store data");
      }
    }

    fetchStore();
  }, []); 

  if (error) return <Typography>{error}</Typography>;
  if (!store) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{}}>
      <StoreDescriptionCard store={store} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Products
      </Typography>
    </Box>
  );
}