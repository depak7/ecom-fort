import { getServerSession } from "next-auth"
import { Box, Grid, Paper, Typography, Divider } from "@mui/material"
import Link from 'next/link'

import ShoppingCart from "@/components/users/cart/ShoppingCart"
import CheckoutProgress from "@/components/users/cart/CheckoutProgress"
import { BaseButton } from "@/components/users/buttons/BaseButton"
import { getCartItems } from "../actions/cart/action"
import { authOptions } from "@/lib/auth"

export default async function AddressPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const { items, totalPrice, totalQuantity } = await getCartItems(userId ?? "null")

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>Your Cart is Empty</Typography>
        <Typography color="text.secondary" mb={4}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <BaseButton>
            Continue Shopping
          </BaseButton>
        </Link>
      </Box>
    )
  }

  const formattedItems = items.map((item) => ({
    ...item,
    price: Number(item.price),
    variant: {
      id: item.variant?.id ?? 0,
      image: item.variant?.image ?? null,
      availableSizes: item.variant?.availableSizes ?? [], 
    },
    size: item.size ?? { id: 0, name: "" },
  }))

  return (
    <Box>
      <CheckoutProgress />
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ShoppingCart items={formattedItems} userId={userId ?? null} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ border: "1px solid black", p: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Price Details
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
              <Typography>Price ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''})</Typography>
              <Typography>₹ {totalPrice}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
              <Typography>Delivery Charges</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹ {totalPrice}
              </Typography>
            </Box>
            <Link href="/cart/address" style={{ textDecoration: 'none' }}>
              <BaseButton fullWidth sx={{ mt: 2 }}>
                Proceed To Shipping
              </BaseButton>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}