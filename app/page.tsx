import ProductGrid from "@/components/users/landing/showcase/ProductGrid";
import StoreGrid from "@/components/users/landing/showcase/StoreGrid";
import TitleCard from "@/components/users/landing/showcase/TitleCard";
import { getAllStores } from "./actions/store/action";
import Footer from "@/components/users/landing/appbar/footer";
import { Box} from "@mui/material";

interface Store {
  id: string;
  name: string;
  logo: string | null;
  city: string;
  address:string;
  description: string;
}

export default async function Home() {
  const res=await getAllStores('')
  const stores: Store[] = (res.stores) || []; 

  return (
<Box
  sx={{
    m: 0,
    p: 0, // avoids horizontal scrollbar
  }}
>
  <TitleCard />
  <StoreGrid stores={stores} />
  <ProductGrid />
  <Footer />
</Box>

  );
}
