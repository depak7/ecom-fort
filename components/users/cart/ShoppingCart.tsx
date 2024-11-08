"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { OutlinedButton, StyledSelect } from "@/components/styledcomponents/StyledElements";
import { BaseButton } from "../buttons/BaseButton";

import { useRouter } from "next/navigation";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/app/actions/cart/action";
import { toggleWishlistItem } from "@/app/actions/wishlist/action";
import { revalidatePath } from "next/cache";

interface CartItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    category: string | null;
  };
  store: {
    id: string;
    name: string;
  };
  variant: {
    id: number;
    image: string | null;
    availableSizes: Array<{ id: number; name: string }>;
  };
  size: {
    id: number;
    name: string;
  };
  isWishlisted: boolean;
}

interface ShoppingCartProps {
  items: CartItem[];
  userId: string | null;
}

export default function ShoppingCart({ items, userId }: ShoppingCartProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [isPending, setIsPending] = useState(false);


  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleCartChange =
    (itemId: number, isSize: boolean) =>
    async (event: SelectChangeEvent<unknown>) => {
      const newValue = event.target.value as string;
      let updatedQuantity = 0;
      let updatedSizeId = 0;

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            if (isSize) {
              updatedSizeId = parseInt(newValue);
              updatedQuantity = item.quantity;
              return { ...item, size: { ...item.size, id: updatedSizeId } };
            } else {
              updatedQuantity = parseInt(newValue, 10);
              updatedSizeId = item.size.id;
              return { ...item, quantity: updatedQuantity };
            }
          }
          return item;
        })
      );

      try {
        const result = await updateCartItemQuantity(
          userId || "",
          itemId,
          updatedQuantity,
          updatedSizeId
        );
        if (result.success) {
          console.log(
            `Cart item ${itemId} updated: Quantity=${updatedQuantity}, SizeId=${updatedSizeId}`
          );
          router.refresh();
        } else {
          console.error("Failed to update cart item:", result.error);
          setCartItems(items);
        }
      } catch (error) {
        console.error("Error updating cart item:", error);
        setCartItems(items);
      }
    };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const result = await removeFromCart(userId || "", itemId);
      if (result.success) {
        console.log(`Item ${itemId} removed from cart`);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        router.refresh();
      } else {
        console.error("Failed to remove item:", result.error);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleWishlistToggle = async (productId: string, variantId: number) => {
    if (!userId) {
      console.log("User not logged in");
      return;
    }
  
    setIsPending(true);
  
    try {
      const result = await toggleWishlistItem(userId, productId, variantId);
      if (result.success) {
        revalidatePath('/cart');
      } else {
        console.error("Failed to update wishlist:", result.error);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box>
      {cartItems.map((item) => (
        <Paper
          key={item.id}
          elevation={0}
          sx={{ border: "1px solid black", p: 2, mb: 2 }}
        >
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mt: 2 }}
          >
            <Image
              src={item.variant.image || "/placeholder.svg"}
              alt={item.product.name}
              width={150}
              height={150}
            />
            <Box sx={{ flexGrow: 1, gap: 2 }}>
              <Typography variant="h6">{item.product.name}</Typography>
              <Typography variant="body2">
                {item.product.category?.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.store.name}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                MRP :<span style={{ color: "black" }}> ₹ {item.price}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                incl. of all taxes
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <StyledSelect
                  value={item.size.id}
                  onChange={handleCartChange(item.id, true)}
                  size="small"
                  sx={{
                    minWidth: 80,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                  }}
                >
                  {item.variant.availableSizes.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                      Size: {size.name.toUpperCase()}
                    </MenuItem>
                  ))}
                </StyledSelect>
                <StyledSelect
                  value={item.quantity}
                  onChange={handleCartChange(item.id, false)}
                  displayEmpty
                  size="small"
                >
                  {[1, 2, 3, 4, 5].map((qty) => (
                    <MenuItem key={qty} value={qty}>
                      Qty: {qty}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}
              >
              <OutlinedButton
              variant="contained"
              onClick={()=>handleWishlistToggle(item.product.id,item.variant.id)}
              disabled={isPending}
              endIcon={
                <FavoriteIcon sx={{ color:item.isWishlisted ? "red" : "inherit" }} />
              }
            >
              {item.isWishlisted ? "Remove from Favorites" : "Add to Favorites"}
            </OutlinedButton>
                <BaseButton
                  sx={{ borderRadius: "50px" }}
                  endIcon={<DeleteOutlineIcon />}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </BaseButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
