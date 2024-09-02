

import { getProductById } from "@/app/actions/products/action";
import ProductDetails from "@/components/users/products/ProductDetails";
import SimilarProducts from "@/components/users/products/SimilarProducts";
import { Box } from "@mui/material";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { id } = params;


  const response = await getProductById(id);

  if (!response || !response.product) {
    return <div>Product not found</div>;
  }

  return (
    <Box>
      <ProductDetails product={response.product} />
      <SimilarProducts />
    </Box>
  );
}



export async function generateMetadata({ params }: ProductPageProps) {
  
  const response = await getProductById(params.id);


  return {
    title: response?.product?.name || 'Product Page',
    description: response?.product?.description || 'Product details page',
  };
}
