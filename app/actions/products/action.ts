"use server"
import { prisma } from '@/database/index';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { generateUniqueProductId } from '@/database/uniqueID';

async function uploadImage(file: File) {
  const blob = await put(file.name, file, { access: 'public' });
  console.log(blob);
  return blob.url;
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const storeId = formData.get('storeId') as string;

    const variantsData = [];
    let variantIndex = 0;

    while (formData.has(`color-${variantIndex}`)) {
      const color = formData.get(`color-${variantIndex}`) as string;
      const variantImage = formData.get(`variantImage-${variantIndex}`) as File | null;
      const additionalImages = formData.getAll(`additionalImages-${variantIndex}`) as File[];

      const sizes = [];
      let sizeIndex = 0;

      while (formData.has(`size-${variantIndex}-${sizeIndex}`)) {
        const size = formData.get(`size-${variantIndex}-${sizeIndex}`) as string;
        const stock = parseInt(formData.get(`stock-${variantIndex}-${sizeIndex}`) as string, 10);
        sizes.push({ size, stock });
        sizeIndex++;
      }

      variantsData.push({ color, variantImage, additionalImages, sizes });
      variantIndex++;
    }

    const id=await generateUniqueProductId();

    const product = await prisma.product.create({
      data: {
        id,
        name,
        description,
        price,
        storeId,
        variants: {
          create: await Promise.all(variantsData.map(async (variant) => {
            const variantImageUrl = variant.variantImage ? await uploadImage(variant.variantImage) : '';
            const additionalImageUrls = await Promise.all(
              variant.additionalImages.map(uploadImage)
            );

            return {
              color: variant.color,
              variantImage: variantImageUrl,
              images: {
                create: additionalImageUrls.map(url => ({ url : url as string }))
              },
              sizes: {
                create: variant.sizes.map(size => ({
                  size: size.size,
                  stock: size.stock
                }))
              }
            };
          }))
        }
      },
      include: {
        variants: {
          include: {
            sizes: true,
            images: true
          }
        }
      }
    });

    revalidatePath(`/store/${storeId}`);
    return { success: true, product };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.delete({
      where: { id: productId },
      include: { store: true }
    });

    revalidatePath(`/store/${product.store.id}`);
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      select:{
        id:true,
        store:true,
        description:true,
        name:true,
        storeId:true,
        price:true,
        variants:{
          select:{
            variantImage:true
          }
        }
        
         
      }
     
    });
    return { success: true, products };
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store:{
          select:{
            name:true
            
            

          }
        },
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        }
      },
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, product };
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return { success: false, error: 'Failed to fetch product' };
  }
}