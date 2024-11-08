import { getProductsByStoreId } from "@/app/actions/products/action";

import ProductCard from "@/components/users/products/ProductCard";
import { Box, Grid} from "@mui/material";


export default async function () {

  const { products } = await getProductsByStoreId('SXZBM25R3V4');

  return (
    <Box >
      <Grid container  spacing={2} p={2}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={3} xl={3} key={product.id}>
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price.toString(),
                store: product.store.name,
                storeId: product.storeId,
                category: "shirt",
                image: product.variants[0]?.variantImage || "",
              }}
              isWishlisted={product.isWishlisted || false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
