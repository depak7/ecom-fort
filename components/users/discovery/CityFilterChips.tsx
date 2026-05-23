"use client"

import React, { useEffect, useState } from "react"
import { Box, Chip, Skeleton, Typography } from "@mui/material"
import { LocationOn as LocationIcon } from "@mui/icons-material"
import { getDistinctCities } from "@/app/actions/store/action"
import { useLocation } from "@/components/users/location/LocationProvider"

type CityFilterChipsProps = {
  label?: string
  showLabel?: boolean
  variant?: "default" | "home"
}

const homeChipSx = {
  borderRadius: "999px",
  height: 32,
  fontSize: "0.8125rem",
  border: "1px solid #e5e7eb",
  bgcolor: "#fff",
  color: "#374151",
  "&:hover": { bgcolor: "#f9fafb" },
  "&.MuiChip-filled": {
    bgcolor: "#374151",
    color: "#fff",
    borderColor: "#374151",
    fontWeight: 600,
    "&:hover": { bgcolor: "#1f2937" },
  },
  "&.MuiChip-outlined": {
    bgcolor: "#fff",
    color: "#6b7280",
  },
}

export default function CityFilterChips({
  label = "Browse by city",
  showLabel = true,
  variant = "default",
}: CityFilterChipsProps) {
  const { selectedCity, setSelectedCity, isHydrated } = useLocation()
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    getDistinctCities().then(setCities).catch(console.error)
  }, [])

  if (!isHydrated) {
    return (
      <Box sx={{ display: "flex", gap: 1, overflow: "hidden" }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" width={80} height={34} sx={{ flexShrink: 0 }} />
        ))}
      </Box>
    )
  }

  const isHome = variant === "home"

  return (
    <Box>
      {showLabel && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
          <LocationIcon sx={{ fontSize: 16, color: "#666" }} />
          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500, fontSize: "0.8125rem" }}>
            {label}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          flexWrap: isHome ? "nowrap" : "wrap",
          overflowX: isHome ? "auto" : "visible",
          pb: isHome ? 0.5 : 0,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Chip
          label="All cities"
          clickable
          onClick={() => setSelectedCity(null)}
          variant={selectedCity === null ? "filled" : "outlined"}
          sx={isHome ? homeChipSx : { fontWeight: selectedCity === null ? 600 : 400 }}
        />
        {cities.map((city) => (
          <Chip
            key={city}
            label={city}
            clickable
            onClick={() => setSelectedCity(city)}
            variant={selectedCity === city ? "filled" : "outlined"}
            sx={{
              ...(isHome ? homeChipSx : {}),
              flexShrink: 0,
              fontWeight: selectedCity === city ? 600 : 400,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
