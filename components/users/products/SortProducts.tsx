import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"

export type SortOption = {
  value: string
  label: string
}

export const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { value: "new-arrivals", label: "New arrivals" },
  { value: "price-low-high", label: "Price: low to high" },
  { value: "price-high-low", label: "Price: high to low" },
]

export const STORE_SORT_OPTIONS: SortOption[] = [
  { value: "", label: "Default" },
  { value: "name", label: "Store name" },
  { value: "city", label: "City" },
]

export const SEARCH_SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "new-arrivals", label: "New arrivals" },
  { value: "price-low-high", label: "Price: low to high" },
  { value: "price-high-low", label: "Price: high to low" },
]

interface SortProductsProps {
  label: string
  options: SortOption[]
  onSortChange: (sort: string) => void
  value?: string
  defaultValue?: string
}

const SortProducts = ({
  label,
  options,
  onSortChange,
  value,
  defaultValue,
}: SortProductsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [internalSort, setInternalSort] = useState(
    defaultValue ?? options[0]?.value ?? ""
  )

  const selectedSort = value !== undefined ? value : internalSort

  useEffect(() => {
    if (value !== undefined) return
    if (defaultValue !== undefined) setInternalSort(defaultValue)
  }, [defaultValue, value])

  const selectedLabel =
    options.find((o) => o.value === selectedSort)?.label ??
    options[0]?.label ??
    ""

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSort = (sortBy: string) => {
    if (value === undefined) setInternalSort(sortBy)
    onSortChange(sortBy)
    handleClose()
  }

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={handleClick}
        endIcon={<ExpandMoreOutlinedIcon sx={{ fontSize: 18, color: "#9ca3af" }} />}
        sx={{
          textTransform: "none",
          fontFamily: "inherit",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "#374151",
          lineHeight: 1.4,
          letterSpacing: "0.01em",
          px: 1.5,
          py: 0.75,
          minHeight: 36,
          borderRadius: 1.5,
          border: "1px solid #e5e7eb",
          bgcolor: "#f9fafb",
          gap: 0.5,
          "&:hover": {
            bgcolor: "#f3f4f6",
            borderColor: "#d1d5db",
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "inherit",
            fontWeight: "inherit",
            lineHeight: "inherit",
            letterSpacing: "inherit",
            color: "#9ca3af",
            mr: 0.25,
          }}
        >
          {label}:
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: "inherit",
            fontWeight: "inherit",
            lineHeight: "inherit",
            letterSpacing: "inherit",
            color: "inherit",
          }}
        >
          {selectedLabel}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 0.75,
            borderRadius: 1.5,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            minWidth: 180,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value || "default"}
            onClick={() => handleSort(option.value)}
            selected={selectedSort === option.value}
            sx={{
              fontSize: "0.8125rem",
              fontWeight: selectedSort === option.value ? 600 : 500,
              color: "#374151",
              py: 1,
              "&.Mui-selected": {
                bgcolor: "#f3f4f6",
                "&:hover": { bgcolor: "#e5e7eb" },
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SortProducts
