"use client"

import React, { useEffect, useState } from "react"
import { Grid, Box, Typography, Button } from "@mui/material"
import ProductCard from "../../products/ProductCard"
import Link from "next/link"
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material"
import { useSession } from "next-auth/react"
import { getAllProducts } from "@/app/actions/products/action"
import { useLocation } from "@/components/users/location/LocationProvider"

const visibleProducts = 3

export default function ProductGrid() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { selectedCity, isHydrated } = useLocation()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (!isHydrated) return

    const load = async () => {
      const response = userId
        ? await getAllProducts(userId, selectedCity)
        : await getAllProducts(undefined, selectedCity)
      setProducts(response.products || [])
    }

    load().catch(console.error)
  }, [userId, selectedCity, isHydrated])

  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 4, md: 5 } }}>
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
              Featured products
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedCity
                ? `Trending in ${selectedCity}`
                : "Fresh picks from nearby stores"}
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/products"
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

        {products.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              px: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px dashed #e2e8f0",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {selectedCity
                ? `No products from ${selectedCity} yet. Try another city above.`
                : "No products available right now."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {products.slice(0, visibleProducts).map((product: any) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price.toString(),
                    store: product.store?.name || "",
                    storeId: product.storeId,
                    productImage: product.productImage,
                    category: product.category || "General",
                    image: product.variants?.[0]?.variantImage || "",
                  }}
                  isWishlisted={product.isWishlisted || false}
                  userId={userId}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
