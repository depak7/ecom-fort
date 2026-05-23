"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Container,
  Stack,
  Button,
  Chip,
} from "@mui/material"
import {
  Search as SearchIcon,
  Store as StoreIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowForward as ArrowForwardIcon,
  Verified as VerifiedIcon,
  LocalShipping as LocalShippingIcon,
  AddBusiness as AddBusinessIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import CityFilterChips from "./CityFilterChips"
import { useLocation } from "@/components/users/location/LocationProvider"

type SearchType = "stores" | "products"

const tabs: { value: SearchType; label: string; icon: React.ReactNode }[] = [
  { value: "stores", label: "Stores", icon: <StoreIcon sx={{ fontSize: 17 }} /> },
  { value: "products", label: "Products", icon: <ShoppingBagIcon sx={{ fontSize: 17 }} /> },
]

const perks = [
  { icon: <StoreIcon sx={{ fontSize: 18 }} />, text: "Nearby stores" },
  { icon: <VerifiedIcon sx={{ fontSize: 18 }} />, text: "Verified sellers" },
  { icon: <LocalShippingIcon sx={{ fontSize: 18 }} />, text: "Delivered in your city" },
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
        bgcolor: "#f7f7f8",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,0,0,0.04), transparent)",
        pt: { xs: 4, md: 6 },
        pb: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
          {/* Pitch */}
          <Box textAlign="center" maxWidth={580}>
            <Chip
              label="Fashion & footwear · shop in your city"
              size="small"
              sx={{
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e5e7eb",
                color: "#4b5563",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: 28,
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Everything you love from stores{" "}
              <Box component="span" sx={{ color: "#6b7280" }}>
                in your city
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.9375rem", sm: "1.05rem" },
                lineHeight: 1.6,
              }}
            >
              Browse top stores near you, find your next outfit or pair of kicks,
              and checkout in one place — no hopping between shops.
            </Typography>
          </Box>

          {/* Search card — primary action */}
          <Box
            sx={{
              width: "100%",
              bgcolor: "#fff",
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "inline-flex" },
                p: 0.4,
                bgcolor: "#f3f4f6",
                borderRadius: 2,
                mb: 2,
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
                      flex: { xs: 1, sm: "unset" },
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.75,
                      px: 2,
                      py: { xs: 1, sm: 0.85 },
                      border: "none",
                      borderRadius: 1.5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#111827" : "#6b7280",
                      bgcolor: active ? "#fff" : "transparent",
                      boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.15s ease",
                      minHeight: { xs: 44, sm: "auto" },
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </Box>
                )
              })}
            </Box>

            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 1.25, sm: 0 },
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  bgcolor: "#f9fafb",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  pl: 1.5,
                  pr: { xs: 1.5, sm: 0.75 },
                  py: { xs: 0.5, sm: 0.75 },
                  minHeight: { xs: 48, sm: "auto" },
                  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  "&:focus-within": {
                    borderColor: "#9ca3af",
                    boxShadow: "0 0 0 3px rgba(17,24,39,0.06)",
                    bgcolor: "#fff",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder={
                    searchType === "stores"
                      ? "Store name…"
                      : "Product name…"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#9ca3af", fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      py: { xs: 1.25, sm: 1.1 },
                      fontSize: "16px",
                      color: "#111827",
                      "&::placeholder": { color: "#9ca3af", opacity: 1 },
                    },
                  }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                fullWidth
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 1.35,
                  minHeight: 48,
                  borderRadius: 2,
                  bgcolor: "#374151",
                  "&:hover": { bgcolor: "#1f2937" },
                }}
              >
                Search
              </Button>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  flexShrink: 0,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  px: 2.5,
                  py: 1,
                  minHeight: 44,
                  borderRadius: 1.5,
                  bgcolor: "#374151",
                  ml: { sm: 1 },
                  "&:hover": { bgcolor: "#1f2937" },
                }}
              >
                Search
              </Button>
            </Box>

            <CityFilterChips variant="home" label="Shopping in" />

            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1.5, color: "#9ca3af", textAlign: "center" }}
            >
              {selectedCity
                ? `Showing stores & products in ${selectedCity}`
                : "Pick a city to see what’s available near you"}
            </Typography>
          </Box>

          {/* Seller CTA */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              p: { xs: 2, sm: 2.5 },
              bgcolor: "#fff",
              borderRadius: 2,
              border: "1px solid #e5e7eb",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AddBusinessIcon sx={{ fontSize: 22, color: "#6b7280" }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#374151">
                  Sell on Ecom-Fort
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "#6b7280", lineHeight: 1.55, maxWidth: 420 }}
                >
                  Own a store? List your products and reach shoppers in your city.
                </Typography>
              </Box>
            </Stack>
            <Button
              onClick={() => router.push("/merchant/addstore")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#374151",
                bgcolor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                minHeight: 44,
                width: { xs: "100%", sm: "auto" },
                flexShrink: 0,
                "&:hover": { bgcolor: "#e5e7eb" },
              }}
            >
              Open your store
            </Button>
          </Box>

          {/* Quick start + trust */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 4 }}
            alignItems="center"
            sx={{ width: "100%", maxWidth: 520 }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Button
                size="small"
                onClick={() => router.push("/stores")}
                startIcon={<StoreIcon sx={{ fontSize: 18 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#374151",
                  bgcolor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
                }}
              >
                Browse stores
              </Button>
              <Button
                size="small"
                onClick={() => router.push("/products")}
                startIcon={<ShoppingBagIcon sx={{ fontSize: 18 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#374151",
                  bgcolor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
                }}
              >
                Shop products
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ pt: 0.5 }}
          >
            {perks.map((perk) => (
              <Stack
                key={perk.text}
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ color: "#6b7280" }}
              >
                <Box sx={{ color: "#9ca3af", display: "flex" }}>{perk.icon}</Box>
                <Typography variant="body2" fontWeight={500} fontSize="0.8125rem">
                  {perk.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
