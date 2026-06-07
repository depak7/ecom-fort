"use client"

import { useMemo, useState, useEffect } from "react"
import { getProductsByStoreId } from "@/app/actions/products/action"
import ProductCard from "@/components/users/products/ProductCard"
import { Box, Grid, CircularProgress, Typography } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

export default function StoresProductGrid({
  storeId,
  sort,
  searchQuery,
  userId,
}: {
  storeId: string
  sort: string
  searchQuery: string
  userId: string | null
}) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = userId
          ? await getProductsByStoreId(storeId, sort, userId)
          : await getProductsByStoreId(storeId, sort)
        setProducts(response.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [storeId, sort, userId])

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || ""
      const category = product.category?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""
      return name.includes(q) || category.includes(q) || description.includes(q)
    })
  }, [products, searchQuery])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" py={8} px={2}>
        <Typography variant="h6" gutterBottom color="#111827">
          No products yet
        </Typography>
        <Typography variant="body2" color="#6b7280">
          This store hasn&apos;t listed any products.
        </Typography>
      </Box>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <Box textAlign="center" py={8} px={2}>
        <SearchIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 1.5 }} />
        <Typography variant="h6" gutterBottom color="#111827">
          No matching products
        </Typography>
        <Typography variant="body2" color="#6b7280">
          Nothing found for &ldquo;{searchQuery.trim()}&rdquo;. Try a different name or category.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {searchQuery.trim() && (
        <Typography
          variant="body2"
          sx={{ px: 2, pt: 2, pb: 0, color: "#6b7280" }}
        >
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </Typography>
      )}
      <Grid container spacing={2} p={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} xl={3} key={product.id}>
            <ProductCard
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store.name,
                productImage: product.productImage,
                storeId: product.storeId,
                category: product.category || "",
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
              userId={userId || undefined}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
