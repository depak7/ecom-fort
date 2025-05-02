import { getProductById, getSimilarProductsByCategory } from "@/app/actions/products/action";
import ProductDetails from "@/components/users/products/ProductDetails";
import SimilarProducts from "@/components/users/products/SimilarProducts";
import { authOptions } from "@/lib/auth";
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


  const similarProduct =userId?await getSimilarProductsByCategory(response.product?.category || "clothes"):await getSimilarProductsByCategory(response.product?.category || "clothes",userId);

  if (!response || !response.product) {
    return <div>Product not found</div>;
  }

  const similarProducts = similarProduct.products?.filter(p => p.id !== response.product.id).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category || '',
    productImage:p.productImage,
    price: p.price.toString(),
    store: p.store.name,
    storeId: p.storeId,
    image: p.variants[0].variantImage || ''
  })) || [];

  return (
    <>
      <ProductDetails product={response.product}  isWishlisted={response.product.isWishlisted || false}  userId={userId?userId:""}/>
      {similarProducts.length > 0 && <SimilarProducts product={similarProducts} />}
    </>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const response = await getProductById(params.id);
  

  return {
    title: response?.product?.name || 'Product Page',
    description: response?.product?.description || 'Product details page',
  };
}
