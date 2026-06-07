"use client"

import Image from "next/image"
import {
  Box,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import {
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material"
import {
  formatStoreAddress,
  getStoreMapsUrl,
} from "@/lib/storeMaps"

export type StoreHeaderData = {
  name: string
  logo: string
  bannerImage?: string | null
  description: string
  city: string
  address: string
  state: string
  pincode: string
  mapLink: string
  offerDescription?: string | null
}

type StoreHeaderProps = {
  store: StoreHeaderData | null
  loading?: boolean
}

export default function StoreHeader({ store, loading }: StoreHeaderProps) {
  if (loading) {
    return (
      <Box sx={{ bgcolor: "#f7f7f8", borderBottom: "1px solid #e5e7eb" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Skeleton variant="rounded" width={88} height={88} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={36} />
              <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
              <Skeleton width="90%" height={20} sx={{ mt: 2 }} />
              <Skeleton width="70%" height={20} sx={{ mt: 0.75 }} />
            </Box>
          </Stack>
        </Container>
      </Box>
    )
  }

  if (!store) return null

  const fullAddress = formatStoreAddress(store)
  const mapsUrl = getStoreMapsUrl(store)

  return (
    <Box
      sx={{
        bgcolor: "#f7f7f8",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {store.bannerImage && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 140, sm: 180, md: 220 },
            bgcolor: "#e5e7eb",
          }}
        >
          <Image
            src={store.bannerImage}
            alt={`${store.name} banner`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ xs: "flex-start", sm: "flex-start" }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 72, sm: 88 },
              height: { xs: 72, sm: 88 },
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
              flexShrink: 0,
            }}
          >
            <Image
              src={store.logo || "/placeholder.svg?height=200&width=350"}
              alt={store.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {store.name}
            </Typography>

            {store.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  maxWidth: 640,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {store.description}
              </Typography>
            )}

            {store.offerDescription && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                }}
              >
                {store.offerDescription}
              </Typography>
            )}

            {fullAddress && mapsUrl && (
              <Box
                component="a"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  maxWidth: "100%",
                  textDecoration: "none",
                  color: "#6b7280",
                  borderRadius: 1.5,
                  px: 1.25,
                  py: 0.75,
                  mx: -1.25,
                  transition: "color 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    color: "#374151",
                    bgcolor: "rgba(0,0,0,0.03)",
                  },
                }}
              >
                <LocationIcon sx={{ fontSize: 17, flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fullAddress}
                </Typography>
                <OpenInNewIcon sx={{ fontSize: 14, flexShrink: 0, opacity: 0.7 }} />
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
