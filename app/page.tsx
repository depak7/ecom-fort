import ProductGrid from "@/components/users/landing/showcase/ProductGrid"
import StoreGrid from "@/components/users/landing/showcase/StoreGrid"
import TitleCard from "@/components/users/landing/showcase/TitleCard"
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
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <TitleCard />
      <DiscoveryPanel />
      <StoreGrid stores={stores} />
      <ProductGrid />
      <Footer />
    </Box>
  )
}
