import { Box, Typography } from "@mui/material"
import { LocationOn as LocationIcon } from "@mui/icons-material"

type StoreCityLabelProps = {
  city: string
  size?: "sm" | "md"
}

export default function StoreCityLabel({ city, size = "sm" }: StoreCityLabelProps) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minWidth: 0, maxWidth: "100%" }}>
      <LocationIcon
        sx={{
          fontSize: size === "md" ? 17 : 15,
          color: "#9ca3af",
          flexShrink: 0,
        }}
      />
      <Typography
        noWrap
        sx={{
          color: "#6b7280",
          fontSize: size === "md" ? "0.875rem" : "0.8125rem",
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {city}
      </Typography>
    </Box>
  )
}
