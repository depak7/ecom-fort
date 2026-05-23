import ProductGrid from "@/components/users/landing/showcase/ProductGrid"
import StoreGrid from "@/components/users/landing/showcase/StoreGrid"
import DiscoveryPanel from "@/components/users/discovery/DiscoveryPanel"
import { getAllStores } from "./actions/store/action"
import Footer from "@/components/users/landing/appbar/footer"
import { Box } from "@mui/material"

interface Store {
  id: string
  name: string
  logo: string | null
  city: string
  address: string
  description: string
}

export default async function Home() {
  const res = await getAllStores("")
  const stores: Store[] = res.stores || []

  return (
    <Box sx={{ bgcolor: "#f7f7f8", minHeight: "100vh" }}>
      <DiscoveryPanel />
      <StoreGrid stores={stores} />
      <ProductGrid />
      <Footer />
    </Box>
  )
}
