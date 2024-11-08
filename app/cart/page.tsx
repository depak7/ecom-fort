import ShoppingCart from "@/components/users/cart/ShoppingCart";
import { getCartItems } from "../actions/cart/action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button, Divider, Grid, Paper, Typography, Box } from "@mui/material";
import CheckoutProgress from "@/components/users/cart/CheckoutProgress";
import Link from 'next/link';
import { BaseButton } from "@/components/users/buttons/BaseButton";

export default async function () {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const { items ,totalPrice,totalQuantity} = await getCartItems(userId ? userId : "null");

  const formattedItems = items.map((item) => ({
    ...item,
    price: Number(item.price),
    variant: {
      id: item.variant?.id || 0,
      image: item.variant?.image || null,
      availableSizes: item.variant?.availableSizes || [], 
    },
    size: item.size || { id: 0, name: "" },
  }));


  return (
    <Box>
      <CheckoutProgress />
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ShoppingCart items={formattedItems} userId={userId || null} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ border: "1px solid black", p: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Price Details
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Price ( {totalQuantity} item )</Typography>
              <Typography>₹ {totalPrice}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Delivery Charges</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" fontWeight={"bold"}>
                {totalPrice}
              </Typography>
            </Box>
            <Link href="/cart/address" style={{ textDecoration: 'none' }}>
              <BaseButton
                fullWidth
           
                sx={{ mt: 2 }}
              >
                Proceed To Shipping
              </BaseButton>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
