"use client"

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

interface ProductProps {
    product: {
      id?: string;
      name: string;
      category: string;
      price: string;
      store: string;
      storeId?:string;
      image: StaticImageData | string;
    };
  }

export default function ProductCard({ product }: ProductProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isMerchantAddProduct  = pathname === '/merchant/addproduct';

    const handleCardClick = (store: string, name: string) => {
        if (isMerchantAddProduct ) return;
      
        const formattedName = name.replace(/\s+/g, "-").toLowerCase();
        
        router.push(`/products/${formattedName}/${product.id}`);
    };

    return (
        <Card
            sx={{
                height: isMerchantAddProduct  ? "40%" : "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid black",
                boxShadow: "none",
                cursor: isMerchantAddProduct ? "default" : "pointer", 
            }}
            onClick={() => handleCardClick(product.store, product.name)}
        >
            <CardMedia
                sx={{
                    position: "relative",
                    height: 320,
                    width: "100%",
                }}
            >
                <Image src={product.image} alt={product.name} layout="fill" />

                <IconButton
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "black",
                      
                    }}
                    disabled={isMerchantAddProduct}
                    aria-label="add to wishlist"
                >
                    <FavoriteBorderOutlinedIcon />
                </IconButton>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight={"bold"}>
                        Store :
                    </Typography>
                    <Typography variant="body2" fontWeight={"bold"}>
                        {product.store}
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                    MRP : ₹ {product.price}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Incl. Of Taxes
                </Typography>

                <Typography
                    variant="caption"
                    display="block"
                    sx={{ fontSize: "0.7rem" }}
                >
                    (Your delivery fee will be determined by the store you choose.)
                </Typography>
            </CardContent>
        </Card>
    );
}