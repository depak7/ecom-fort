"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Package } from "lucide-react"
import UseCustomToast from "@/components/ui/useCustomToast"
import ProductCard from "@/components/users/products/ProductCard"
import { Grid } from "@mui/material"


function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card animate-pulse">
      <div className="h-56 bg-muted" />
      <div className="flex-1 space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted" />
      </div>
    </div>
  )
}

export default function ImageResultsPage() {
  const { token } = useParams()
  const router = useRouter()
  const { errorToast } = UseCustomToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.post(`/api/search`, { token })
        if (data.status) {
          setProducts(data.productsWithWishlistStatus || [])
        } else {
          errorToast(data.message || "No results found")
          router.push("/")
        }
      } catch (err) {
        console.error("Failed to fetch products:", err)
        errorToast("Error fetching results. Redirecting...")
        setTimeout(() => router.push("/"), 1500)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchProducts()
  }, [token])


  if (loading) {
    return (


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

    )
  }

  if (products.length === 0) {
    router.push("/")
    errorToast("Sorry,we can&apos;t any products");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-3xl font-bold tracking-tight">Similar Products</h3>
            </div>
          </div>
        </div>
        <Grid container spacing={3}>
        {products.map((product) => (
        <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store.name,
                storeId: product.storeId,
                productImage: product.productImage,
                category: product.category,
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
              userId={""}
            />
          </Grid>  ))}
          </Grid>
      </div>
    </div>
  )
}
