"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { toggleWishlistItem } from "@/app/actions/wishlist/action";

export interface ProductProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    store: string;
    storeId?: string;
    image: string;
  };
  isWishlisted?: boolean;
  userId?: string;
}

export default function ProductCard({
  product,
  isWishlisted,
  userId,
}: ProductProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [isPending, setIsPending] = useState(false);

  const isMerchantAddProduct = pathname === "/merchant/addproduct";

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMerchantAddProduct) return;

    const formattedName = product.name.replace(/\s+/g, "-").toLowerCase();
    router.push(`/products/${formattedName}/${product.id}`);
  };

  const handleWishlistToggle = useCallback(async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the card click event from firing

    if (!userId) {
      console.log("User not logged in");
      return;
    }

    setIsPending(true);

    try {
      const result = await toggleWishlistItem(userId, product.id, 1);
      if (result.success) {
        setInWishlist((prev) => !prev);
      } else {
        console.error("Failed to update wishlist:", result.error);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsPending(false);
    }
  }, [userId, product.id]);

  return (
    <Card
      sx={{
        height: isMerchantAddProduct ? "40%" : "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        boxShadow: "none",
        cursor: isMerchantAddProduct ? "default" : "pointer",
      }}
      onClick={handleCardClick}
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
            color: inWishlist ? "red" : "black",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          disabled={isMerchantAddProduct || isPending}
          aria-label={inWishlist ? "remove from wishlist" : "add to wishlist"}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
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