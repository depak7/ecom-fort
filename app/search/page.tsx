'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Grid, 
  CircularProgress, 
  Container
} from '@mui/material'
import { Store as StoreIcon, ShoppingBag } from '@mui/icons-material'
import StoreCard from '@/components/users/stores/StoreCard'
import ProductCard from '@/components/users/products/ProductCard'
import { BaseButton } from '@/components/users/buttons/BaseButton'

type SearchResults = {
  stores: any[]
  productsWithWishlistStatus: any[]
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTab, setActiveTab] = useState('stores')
  const [searchResults, setSearchResults] = useState<SearchResults>({ stores: [], productsWithWishlistStatus: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      fetch(`/api/search?query=${encodeURIComponent(query)}&userId=${''}`)
        .then(response => response.json())
        .then(data => {
          if(data.status){
            setSearchResults(data)
            setIsLoading(false)
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error)
          setIsLoading(false)
        })
    }
  }, [query])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  const hasResults = searchResults.stores.length > 0 || searchResults.productsWithWishlistStatus.length > 0

  const hasStores = searchResults.stores.length > 0
  const hasProducts = searchResults.productsWithWishlistStatus.length > 0

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="search results tabs"
          sx={{
            mb: 3,
            '& .MuiTab-root.Mui-selected': {
              color: 'black',
              backgroundColor: 'transparent',
            },
            '& .MuiTabs-indicator': {
                backgroundColor: 'grey',  // Bottom bar color change (active tab indicator)
              },
          }}
        >
          <Tab 
            label={`Stores (${searchResults.stores.length})`} 
            value="stores" 
            icon={<StoreIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Products (${searchResults.productsWithWishlistStatus.length})`} 
            value="products" 
            icon={<ShoppingBag />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Store results */}
        {activeTab === 'stores' && (
          <>
            {hasStores ? (
              <Grid container spacing={3}>
                {searchResults.stores.map((store) => (
                  <Grid item xs={12} sm={6} md={4} key={store.id}>
                    <StoreCard store={store} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={6}>
                <StoreIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  No stores found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We couldn&apos;t find any stores matching &quot;{query}&quot;.
                </Typography>
                <BaseButton component={Link} href="/" variant="contained">
                  Return to Home
                </BaseButton>
              </Box>
            )}
          </>
        )}

        {/* Product results */}
        {activeTab === 'products' && (
          <>
            {hasProducts ? (
              <Grid container spacing={3}>
                {searchResults.productsWithWishlistStatus.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price.toString(), 
                        store: product.store.name,
                        storeId: product.storeId,
                        productImage:product.productImage,
                        category: "shirt",
                        image: product.variants[0]?.variantImage || "", 
                      }}
                      isWishlisted={product.isWishlisted || false}
                      userId={""}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={6}>
                <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We couldn&apos;t find any products matching &quot;{query}&quot;.
                </Typography>
                <BaseButton component={Link} href="/" variant="contained">
                  Return to Home
                </BaseButton>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  )
}