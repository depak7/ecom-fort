"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Container,
  Stack,
} from "@mui/material"
import {
  Search as SearchIcon,
  Store as StoreIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import CityFilterChips from "./CityFilterChips"
import { useLocation } from "@/components/users/location/LocationProvider"

type SearchType = "stores" | "products"

const tabs: { value: SearchType; label: string; icon: React.ReactNode }[] = [
  { value: "stores", label: "Stores", icon: <StoreIcon sx={{ fontSize: 18 }} /> },
  { value: "products", label: "Products", icon: <ShoppingBagIcon sx={{ fontSize: 18 }} /> },
]

export default function DiscoveryPanel() {
  const router = useRouter()
  const { selectedCity } = useLocation()
  const [searchType, setSearchType] = useState<SearchType>("products")
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#discover") {
      document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) {
      router.push(searchType === "stores" ? "/stores" : "/products")
      return
    }

    const params = new URLSearchParams({
      q: query.trim(),
      type: searchType,
    })
    if (selectedCity) params.set("city", selectedCity)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Box
      id="discover"
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)",
        pt: { xs: 4, md: 5 },
        pb: { xs: 5, md: 6 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -120,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,172,193,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={{ xs: 3, md: 3.5 }} alignItems="center">
          <Box textAlign="center" maxWidth={520}>
            <Typography
              variant="overline"
              sx={{
                color: "#00acc1",
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: "0.7rem",
              }}
            >
              Styles from your city
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={800}
              sx={{
                mt: 1,
                mb: 1,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                lineHeight: 1.15,
                color: "#0f172a",
              }}
            >
              Shop local stores & products
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.95rem" }}>
              Search what you want, filter by city, and explore nearby sellers.
            </Typography>
          </Box>

          {/* Tab pills */}
          <Box
            sx={{
              display: "inline-flex",
              p: 0.5,
              bgcolor: "#e2e8f0",
              borderRadius: "999px",
              gap: 0.5,
            }}
          >
            {tabs.map((tab) => {
              const active = searchType === tab.value
              return (
                <Box
                  key={tab.value}
                  component="button"
                  type="button"
                  onClick={() => setSearchType(tab.value)}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: { xs: 2, sm: 2.5 },
                    py: 1,
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#0f172a" : "#64748b",
                    bgcolor: active ? "#ffffff" : "transparent",
                    boxShadow: active ? "0 2px 8px rgba(15,23,42,0.08)" : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#0f172a",
                    },
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </Box>
              )
            })}
          </Box>

          {/* Search bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              alignItems: "center",
              bgcolor: "#fff",
              borderRadius: "999px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
              pl: { xs: 1.5, sm: 2 },
              pr: 0.75,
              py: 0.75,
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
              "&:focus-within": {
                borderColor: "#00acc1",
                boxShadow: "0 8px 32px rgba(0, 172, 193, 0.18)",
              },
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder={
                searchType === "stores"
                  ? "Search stores…"
                  : "Search products…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  py: 1,
                  fontSize: "0.95rem",
                  "&::placeholder": { color: "#94a3b8", opacity: 1 },
                },
              }}
            />
            <IconButton
              type="submit"
              aria-label="Search"
              sx={{
                bgcolor: "#0f172a",
                color: "#fff",
                width: 44,
                height: 44,
                flexShrink: 0,
                "&:hover": { bgcolor: "#1e293b" },
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Quick links */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Typography
              component="button"
              type="button"
              onClick={() => router.push("/stores")}
              sx={{
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                font: "inherit",
                fontSize: "0.8125rem",
                color: "#64748b",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                "&:hover": { color: "#0f172a" },
              }}
            >
              Browse all stores
            </Typography>
            <Typography
              component="button"
              type="button"
              onClick={() => router.push("/products")}
              sx={{
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                font: "inherit",
                fontSize: "0.8125rem",
                color: "#64748b",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                "&:hover": { color: "#0f172a" },
              }}
            >
              Browse all products
            </Typography>
          </Stack>

          {/* City filter */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 640,
              pt: 1,
              borderTop: "1px solid",
              borderColor: "rgba(226, 232, 240, 0.8)",
            }}
          >
            <CityFilterChips variant="home" label="Filter by city" />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
