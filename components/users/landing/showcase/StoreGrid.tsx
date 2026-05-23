"use client"

import { Grid, Box, Typography, Button } from "@mui/material"
import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material"
import StoreCard from "../../stores/StoreCard"
import { useLocation } from "@/components/users/location/LocationProvider"

interface Store {
  id: string
  name: string
  logo: string | null
  city: string
  address: string
  description: string
}

interface StoreGridProps {
  stores: Store[]
}

export default function StoreGrid({ stores }: StoreGridProps) {
  const [visibleStores, setVisibleStores] = useState(3)
  const { selectedCity, isHydrated } = useLocation()

  const displayStores = useMemo(() => {
    if (!isHydrated || !selectedCity) return stores
    return stores.filter(
      (store) => store.city.toLowerCase() === selectedCity.toLowerCase()
    )
  }, [stores, selectedCity, isHydrated])

  useEffect(() => {
    const handleResize = () => {
      setVisibleStores(window.innerWidth < 600 ? 2 : 3)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Box sx={{ bgcolor: "#fff", py: { xs: 4, md: 5 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Featured stores
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedCity ? `Curated picks in ${selectedCity}` : "Popular local sellers"}
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/stores"
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#0f172a",
              flexShrink: 0,
              "&:hover": { bgcolor: "rgba(15,23,42,0.04)" },
            }}
          >
            View all
          </Button>
        </Box>

        {displayStores.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              px: 2,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px dashed #e2e8f0",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {selectedCity
                ? `No stores in ${selectedCity} yet. Try another city above.`
                : "No stores available right now."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {displayStores.slice(0, visibleStores).map((store) => (
              <Grid item xs={12} sm={6} md={4} key={store.id}>
                <StoreCard store={store} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
