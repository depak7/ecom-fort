import { Box, Container, Grid, Typography, Paper, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/users/products/ProductCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getWishlistedItems } from "../actions/wishlist/action";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BaseButton } from "@/components/users/buttons/BaseButton";
import login from '@/components/assets/users/login-ecom.png'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let products;


  if (userId) {
    products = await getWishlistedItems(userId);
  }

  if (!userId) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Image
            src={login}
            alt="Login required"
            width={200}
            height={200}
          />
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 2 }}>
            Login Required
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You must log in to see your wishlist products.
          </Typography>
          <BaseButton
            variant="contained"
            color="primary"
            component={Link}
            href="/signin"
          >
            Log In
          </BaseButton  >
        </Paper>
      </Container>
    );
  }

  if (!products || products.products?.length === 0) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 100, color: 'grey', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Start adding products to your wishlist to see them here.
          </Typography>
          <BaseButton
          
            component={Link}
            href="/products"
          >
            Explore Products
          </BaseButton>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h6" fontWeight={700}>
        Your Wishlists
      </Typography>
      <Grid container spacing={3}>
        {products.products?.map((product) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
            <ProductCard
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store.name,
                storeId: product.storeId,
                productImage:product.productImage,
                category: "shirt",
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
              userId={userId}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}