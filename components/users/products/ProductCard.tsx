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
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { toggleWishlistItem } from "@/app/actions/wishlist/action";
import UseCustomToast from "@/components/ui/useCustomToast";

export interface ProductProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    productImage:string;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {errorToast}=UseCustomToast();
  const isMerchantAddProduct = pathname === "/merchant/addproduct";

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMerchantAddProduct) return;

    const formattedName = product.name.replace(/\s+/g, "-").toLowerCase();
    router.push(`/products/${formattedName}/${product.id}`);
  };

  const storePageHref =
    product.storeId && product.store
      ? `/stores/${product.storeId}/${encodeURIComponent(product.store)}`
      : null;

  const handleStoreClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (storePageHref) router.push(storePageHref);
  };

  const handleWishlistToggle = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation(); 

      if (!userId) {
        errorToast("please login to add wishlist products");
        return;
      }

      setIsPending(true);

      try {
        const result = await toggleWishlistItem(userId, product.id);
        console.log(result);
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
    },
    [userId, product.id]
  );

  return (
    <Card
      sx={{
        height: isMerchantAddProduct ? "40%" : "90%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        boxShadow: "none",
        cursor: isMerchantAddProduct ? "default" : "pointer",
        maxWidth: isMobile ? "100%" : "none",
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        sx={{
          position: "relative",
          height: isMobile ? 200 : 320,
          width: "100%",
        }}
      >
        <Image
          src={product.productImage}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />

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
            padding: isMobile ? "4px" : "8px",
          }}
          disabled={isMerchantAddProduct || isPending}
          aria-label={inWishlist ? "remove from wishlist" : "add to wishlist"}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? (
            <FavoriteIcon fontSize={isMobile ? "small" : "medium"} />
          ) : (
            <FavoriteBorderOutlinedIcon
              fontSize={isMobile ? "small" : "medium"}
            />
          )}
        </IconButton>
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, pt: 2, px: isMobile ? 1 : 2 , overflow: "hidden",}}>
        <Typography
          gutterBottom
          variant={isMobile ? "subtitle2" : "h6"}
          component="div"
          noWrap
          fontWeight={700}
        >
          {product.name.toLocaleUpperCase()}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.25,
            minWidth: 0,
          }}
        >
          <StorefrontOutlinedIcon
            sx={{ fontSize: 15, color: "#9ca3af", flexShrink: 0 }}
          />
          {storePageHref ? (
            <Link
              component="button"
              type="button"
              onClick={handleStoreClick}
              underline="hover"
              sx={{
                fontSize: isMobile ? "0.8125rem" : "0.875rem",
                fontWeight: 600,
                color: "#6b7280",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                p: 0,
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                "&:hover": { color: "#374151" },
              }}
            >
              {product.store}
            </Link>
          ) : (
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontSize: isMobile ? "0.8125rem" : "0.875rem",
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              {product.store}
            </Typography>
          )}
        </Box>

        <Typography
          variant={isMobile ? "body2" : "body1"}
          fontWeight={700}
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          MRP : ₹ {product.price}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1, fontSize: isMobile ? "0.6rem" : "0.75rem" }}
        >
          Incl. Of Taxes
        </Typography>
        {!isMobile && (
          <Typography
            variant="caption"
            display="block"
            sx={{ fontSize: isMobile ? "0.6rem" : "0.7rem" }}
          >
            (Your delivery fee will be determined by the store you choose.)
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
