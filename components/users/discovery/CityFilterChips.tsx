"use client"

import React, { useEffect, useState } from "react"
import {
  Box,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material"
import { LocationOn as LocationIcon } from "@mui/icons-material"
import { getDistinctCities } from "@/app/actions/store/action"
import { useLocation } from "@/components/users/location/LocationProvider"

type CityFilterChipsProps = {
  label?: string
  showLabel?: boolean
  variant?: "default" | "home"
}

const chipSx = {
  home: {
    borderRadius: "999px",
    height: 36,
    px: 0.5,
    fontSize: "0.8125rem",
    border: "1px solid",
    borderColor: "transparent",
    bgcolor: "#fff",
    color: "text.primary",
    boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
    "&:hover": { bgcolor: "#fff", boxShadow: "0 2px 8px rgba(15,23,42,0.08)" },
    "&.MuiChip-filled": {
      bgcolor: "#0f172a",
      color: "#fff",
      fontWeight: 600,
      boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
      "&:hover": { bgcolor: "#1e293b" },
    },
  },
  default: {},
} as const

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
      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", overflow: "hidden" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rounded" width={88} height={36} sx={{ borderRadius: 999, flexShrink: 0 }} />
        ))}
      </Box>
    )
  }

  const isHome = variant === "home"

  return (
    <Box>
      {showLabel && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
          <LocationIcon sx={{ fontSize: 17, color: isHome ? "#64748b" : "text.secondary" }} />
          <Typography
            variant="body2"
            sx={{
              color: isHome ? "#64748b" : "text.secondary",
              fontWeight: 500,
              fontSize: "0.8125rem",
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: isHome ? "nowrap" : "wrap",
          overflowX: isHome ? "auto" : "visible",
          pb: isHome ? 0.5 : 0,
          mx: isHome ? -0.5 : 0,
          px: isHome ? 0.5 : 0,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Chip
          label="All cities"
          clickable
          onClick={() => setSelectedCity(null)}
          variant={selectedCity === null ? "filled" : "outlined"}
          sx={isHome ? chipSx.home : { fontWeight: selectedCity === null ? 600 : 400 }}
        />
        {cities.map((city) => (
          <Chip
            key={city}
            label={city}
            clickable
            onClick={() => setSelectedCity(city)}
            variant={selectedCity === city ? "filled" : "outlined"}
            sx={{
              ...(isHome ? chipSx.home : {}),
              flexShrink: 0,
              fontWeight: selectedCity === city ? 600 : 400,
              ...(!isHome && selectedCity === city ? {} : {}),
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
