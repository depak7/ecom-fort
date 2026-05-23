"use client"

import React from "react"
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Container,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import CityFilterChips from "./CityFilterChips"
import { useLocation } from "@/components/users/location/LocationProvider"

type BrowseToolbarProps = {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  children?: React.ReactNode
}

export default function BrowseToolbar({
  title,
  subtitle,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  children,
}: BrowseToolbarProps) {
  const { selectedCity } = useLocation()

  return (
    <Box
      sx={{
        bgcolor: "#f7f7f8",
        borderBottom: "1px solid #e5e7eb",
        py: { xs: 2.5, md: 3 },
        mb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={700} gutterBottom color="#111827">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
            {subtitle}
            {selectedCity ? ` · Showing results in ${selectedCity}` : ""}
          </Typography>
        )}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 1,
            border: "1px solid #e5e5e5",
            bgcolor: "#fff",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "#fafafa",
                "&.Mui-focused fieldset": { borderColor: "#000" },
              },
            }}
          />

          <CityFilterChips label="Filter by city" />

          {children && <Box sx={{ mt: 2 }}>{children}</Box>}
        </Paper>
      </Container>
    </Box>
  )
}
