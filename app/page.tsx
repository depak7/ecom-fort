


import ProductGrid from "@/components/users/landing/showcase/ProductGrid";
import StoreGrid from "@/components/users/landing/showcase/StoreGrid";
import TitleCard from "@/components/users/landing/showcase/TitleCard";
import { getAllStores } from "./actions/store/action";

import nikeLogo from "@/components/assets/users/Nike.png";
import pumaLogo from "@/components/assets/users/puma.png";
import souledStoreLogo from "@/components/assets/users/souled.png";
import adidasLogo from "@/components/assets/users/Adidas.png";


export default async function Home() {

//  const stores = await getAllStores();

  const stores = [
    { id:1,name: "Nike", logo: nikeLogo, location: "India" ,description:"hii"},
    { id:2,name: "Puma", logo: pumaLogo, location: "India", description:"hii"},
    {id:3, name: "The Souled Store", logo: souledStoreLogo, location: "India",description:"hii" },
    {id:4, name: "Adidas", logo: adidasLogo, location: "Saravanapatti",description:"hii" },
    { id:5,name: "Snipes", logo: nikeLogo, location: "Coimbatore" ,description:"hii"},
  ];
  

  return (
    <>
    <TitleCard/>
    <StoreGrid stores={stores}/>
    <ProductGrid/>

    </>
    
   
    );
}
