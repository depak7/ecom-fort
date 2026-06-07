"use client"

import React from "react"
import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import SortProducts, { PRODUCT_SORT_OPTIONS } from "@/components/users/products/SortProducts"

type StoreNavbarProps = {
  storeName: string
  searchQuery: string
  onSearchChange: (value: string) => void
  mapsUrl?: string | null
  loading?: boolean
  onSortChange: (sort: string) => void
}

export default function StoreNavbar({
  storeName,
  searchQuery,
  onSearchChange,
  mapsUrl,
  loading = false,
  onSortChange,
}: StoreNavbarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #e5e7eb",
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.25,
          px: { xs: 2, sm: 3 },
          py: { xs: 1.25, sm: 1.5 },
          minHeight: "unset",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {loading ? (
              <Skeleton
                variant="text"
                width={isMobile ? "55%" : "35%"}
                height={isMobile ? 24 : 28}
              />
            ) : (
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  color: "#111827",
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.25,
                }}
              >
                {storeName}
              </Typography>
            )}
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <SortProducts
              label="Sort products"
              options={PRODUCT_SORT_OPTIONS}
              defaultValue="new-arrivals"
              onSortChange={onSortChange}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          {loading ? (
            <Skeleton variant="rounded" height={40} sx={{ flex: 1, borderRadius: 1.5 }} />
          ) : (
            <TextField
              fullWidth
              size="small"
              placeholder="Search products in this store…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9ca3af", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  bgcolor: "#f9fafb",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused": { bgcolor: "#fff" },
                },
                "& .MuiInputBase-input": {
                  py: 1.1,
                },
              }}
            />
          )}

          {!loading && mapsUrl && (
            <Tooltip title="Open store location in Maps">
              <IconButton
                component="a"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="Open store location in Maps"
                sx={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  border: "1px solid #e5e7eb",
                  borderRadius: 1.5,
                  bgcolor: "#f9fafb",
                  color: "#6b7280",
                  "&:hover": {
                    bgcolor: "#f3f4f6",
                    borderColor: "#d1d5db",
                    color: "#374151",
                  },
                }}
              >
                <LocationIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
