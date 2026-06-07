'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material'
import { Store as StoreIcon, ShoppingBag, Search as SearchIcon } from '@mui/icons-material'
import StoreCard from '@/components/users/stores/StoreCard'
import ProductCard from '@/components/users/products/ProductCard'
import { BaseButton } from '@/components/users/buttons/BaseButton'
import BrowseToolbar from '@/components/users/discovery/BrowseToolbar'
import SortProducts, { SEARCH_SORT_OPTIONS } from '@/components/users/products/SortProducts'
import { useLocation } from '@/components/users/location/LocationProvider'

type SearchResults = {
  stores: any[]
  productsWithWishlistStatus: any[]
  categories?: string[]
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const urlCity = searchParams.get('city')
  const urlType = searchParams.get('type')
  const { selectedCity, setSelectedCity, isHydrated } = useLocation()

  const effectiveCity = urlCity || selectedCity || null

  const [inputQuery, setInputQuery] = useState(query)
  const [activeTab, setActiveTab] = useState(urlType === 'products' ? 'products' : 'stores')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('relevance')
  const [categories, setCategories] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResults>({
    stores: [],
    productsWithWishlistStatus: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [tabInitialized, setTabInitialized] = useState(Boolean(urlType))

  useEffect(() => {
    setInputQuery(query)
  }, [query])

  useEffect(() => {
    if (urlCity && urlCity !== selectedCity) {
      setSelectedCity(urlCity)
    }
  }, [urlCity, selectedCity, setSelectedCity])

  useEffect(() => {
    if (urlType === 'products' || urlType === 'stores') {
      setActiveTab(urlType)
      setTabInitialized(true)
    }
  }, [urlType])

  const fetchResults = useCallback(async () => {
    if (!query) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams({ query, sort })
      if (effectiveCity) params.set('city', effectiveCity)
      if (category) params.set('category', category)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (data.status) {
        setSearchResults(data)
        if (data.categories) setCategories(data.categories)

        if (!tabInitialized) {
          const productCount = data.productsWithWishlistStatus?.length ?? 0
          const storeCount = data.stores?.length ?? 0
          setActiveTab(productCount > storeCount ? 'products' : 'stores')
          setTabInitialized(true)
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setIsLoading(false)
    }
  }, [query, effectiveCity, category, sort, tabInitialized])

  useEffect(() => {
    if (isHydrated) fetchResults()
  }, [fetchResults, isHydrated])

  useEffect(() => {
    setTabInitialized(Boolean(urlType))
  }, [query, effectiveCity, urlType])

  const pushSearch = (nextQuery: string) => {
    if (!nextQuery.trim()) return
    const params = new URLSearchParams({ q: nextQuery.trim(), type: activeTab })
    if (effectiveCity) params.set('city', effectiveCity)
    router.push(`/search?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setInputQuery(value)
    if (value.trim() && value.endsWith('\n')) {
      pushSearch(value.trim())
    }
  }

  const hasStores = searchResults.stores.length > 0
  const hasProducts = searchResults.productsWithWishlistStatus.length > 0

  if (!query) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <SearchIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Search stores & products
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Use the discovery panel on the home page to search and filter by city.
        </Typography>
        <BaseButton component={Link} href="/#discover" variant="contained">
          Go to search
        </BaseButton>
      </Container>
    )
  }

  return (
    <Box sx={{ pb: 4 }}>
      <BrowseToolbar
        title="Search results"
        subtitle={`Showing matches for "${query}"`}
        searchPlaceholder="Refine your search…"
        searchValue={inputQuery}
        onSearchChange={(value) => {
          setInputQuery(value)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="search-category-label">Category</InputLabel>
              <Select
                labelId="search-category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <SortProducts
              label="Sort results"
              options={SEARCH_SORT_OPTIONS}
              value={sort}
              defaultValue="relevance"
              onSortChange={setSort}
            />
          </Box>

          <BaseButton
            variant="contained"
            size="small"
            onClick={() => pushSearch(inputQuery)}
          >
            Update search
          </BaseButton>
        </Box>
      </BrowseToolbar>

      <Container maxWidth="lg">
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={0} sx={{ p: { xs: 0, sm: 1 } }}>
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
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

            {activeTab === 'stores' && (
              hasStores ? (
                <Grid container spacing={3}>
                  {searchResults.stores.map((store) => (
                    <Grid item xs={12} sm={6} md={4} key={store.id}>
                      <StoreCard store={store} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" gutterBottom>
                    No stores found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try another city or broaden your search terms.
                  </Typography>
                </Box>
              )
            )}

            {activeTab === 'products' && (
              hasProducts ? (
                <Grid container spacing={3}>
                  {searchResults.productsWithWishlistStatus.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <ProductCard
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price.toString(),
                          store: product.store.name,
                          storeId: product.storeId,
                          productImage: product.productImage,
                          category: product.category,
                          image: product.variants[0]?.variantImage || '',
                        }}
                        isWishlisted={product.isWishlisted || false}
                        userId=""
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try another category, city, or search term.
                  </Typography>
                </Box>
              )
            )}
          </Paper>
        )}
      </Container>
    </Box>
  )
}
