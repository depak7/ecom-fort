import { getProductById, getSimilarProductsByCategory } from "@/app/actions/products/action";
import ProductDetails from "@/components/users/products/ProductDetails";
import SimilarProducts from "@/components/users/products/SimilarProducts";
import { authOptions } from "@/lib/auth";
import { Box } from "@mui/material";
import { getServerSession } from "next-auth";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  const response =userId?await getProductById(id,userId):await getProductById(id)


  const similarProduct = await getSimilarProductsByCategory(response.product?.category || "clothes");

  if (!response || !response.product) {
    return <div>Product not found</div>;
  }

  const similarProducts = similarProduct.products?.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category || '',
    price: p.price.toString(),
    store: p.store.name,
    storeId: p.storeId,
    image: p.variants[0].variantImage || ''
  })) || [];

  return (
    <Box>
      <ProductDetails product={response.product}  isWishlisted={response.product.isWishlisted || false}  userId={userId?userId:""}/>
      <SimilarProducts product={similarProducts} />
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
