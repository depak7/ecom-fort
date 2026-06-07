"use client"

import { useEffect, useMemo, useState } from "react"
import { getStoreById } from "@/app/actions/store/action"
import StoreHeader, { type StoreHeaderData } from "@/components/merchant/storethemes/StoreHeader"
import StoreNavbar from "@/components/merchant/storethemes/StoreNavbar"
import StoresProductGrid from "@/components/merchant/storethemes/StoresProductGrid"
import { decodeRouteParam } from "@/lib/decodeRouteParam"
import { getStoreMapsUrl } from "@/lib/storeMaps"

interface StoreGridWrapperProps {
  storeId: string
  storeName: string
  userId: string | null
}

export default function StoreGridWrapper({
  storeId,
  storeName,
  userId,
}: StoreGridWrapperProps) {
  const [sortOption, setSortOption] = useState<string>("new-arrivals")
  const [searchQuery, setSearchQuery] = useState("")
  const [store, setStore] = useState<StoreHeaderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchStore = async () => {
      setLoading(true)
      try {
        const result = await getStoreById(storeId)
        if (!cancelled && result.success && result.store) {
          setStore(result.store as StoreHeaderData)
        }
      } catch (error) {
        console.error("Failed to load store details:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStore()
    return () => {
      cancelled = true
    }
  }, [storeId])

  const decodedStoreName = useMemo(() => decodeRouteParam(storeName), [storeName])
  const displayName = store?.name || decodedStoreName
  const mapsUrl = store ? getStoreMapsUrl(store) : null

  return (
    <>
      <StoreHeader store={store} loading={loading} />
      <StoreNavbar
        storeName={displayName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mapsUrl={mapsUrl}
        loading={loading}
        onSortChange={(sort) => setSortOption(sort)}
      />
      <StoresProductGrid
        storeId={storeId || ""}
        sort={sortOption}
        searchQuery={searchQuery}
        userId={userId || null}
      />
    </>
  )
}
