"use server";


import  prisma  from "@/database/index";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { generateUniqueProductId } from "@/database/uniqueID";
import { readOnlyPrisma } from "@/database/index";
import Decimal from "decimal.js";

async function uploadImage(file: File) {
  try {
    // Convert File to Blob (browser native)
    if(file){
    const blobFile = new Blob([file], { type: file.type });

    const blob = await put(file.name, blobFile, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

   
    return blob.url;
  }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Define the interface for the variant data
interface VariantData {
  color: string;
  variantImage: string;
  images: {
    create: { url: string }[];
  };
  sizes: {
    create: { size: string; stock: number }[];
  };
}

// Update the variantsData declaration to use the interface
const variantsData: VariantData[] = [];

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const brand=formData.get("brandName") as string;
    const category = formData.get("category") as string;
    const price = new Decimal(parseFloat(formData.get("price") as string));
    const storeId = formData.get("storeId") as string;


    const variantsData = await processVariantData(formData);

    const id = await generateUniqueProductId();

    const product = await prisma.product.create({
      data: {
        id,
        name,
        brand,
        category,
        description,
        price,
        storeId,
        variants: {
          create: variantsData,
        },
      },
      include: {
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        },
      },
    });

    revalidatePath(`/store/${storeId}`);
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

async function processVariantData(formData: FormData) {
  const variantsData: VariantData[] = [];
  let variantIndex = 0;

  while (formData.has(`color-${variantIndex}`)) {
    const color = formData.get(`color-${variantIndex}`) as string;
    const variantImage = formData.get(`variantImage-${variantIndex}`) as File | null;
    const additionalImages = formData.getAll(`additionalImages-${variantIndex}`) as File[];
    
    // Combine all images into a single array for processing
    const allImages = variantImage ? [variantImage, ...additionalImages] : additionalImages;
    
    // Upload all images at once
    const uploadedUrls = await Promise.all(allImages.map(uploadImage));
    
    const [variantImageUrl, ...additionalImageUrls] = uploadedUrls;

    // Process sizes
    const sizes = processSizes(formData, variantIndex);

    variantsData.push({
      color,
      variantImage: variantImageUrl || "",
      images: {
        create: additionalImageUrls.map(url => ({
          url: url as string,
        })),
      },
      sizes: {
        create: sizes,
      },
    });

    variantIndex++;
  }

  return variantsData;
}

function processSizes(formData: FormData, variantIndex: number) {
  const sizes: { size: string; stock: number }[] = [];
  let sizeIndex = 0;

  while (formData.has(`size-${variantIndex}-${sizeIndex}`)) {
    const size = formData.get(`size-${variantIndex}-${sizeIndex}`) as string;
    const stock = parseInt(
      formData.get(`stock-${variantIndex}-${sizeIndex}`) as string,
      10
    );
    sizes.push({ size, stock });
    sizeIndex++;
  }

  return sizes;
}

export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.delete({
      where: { id: productId },
      include: { store: true },
    });

    revalidatePath(`/store/${product.store.id}`);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}


export async function getAllProducts(userId?: string) {
  try {
    const products = await readOnlyPrisma.product.findMany({
      select: {
        id: true,
        store: true,
        category: true,
        description: true,
        name: true,
        storeId: true,
        price: true,
        variants: {
          select: {
            variantImage: true,
          },
        },
        wishlistItems: userId ? {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        } : false,
      },
    });

    const productsWithWishlistStatus = products.map(product => ({
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    }));

    return { success: true, products: productsWithWishlistStatus };
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}


export async function getProductById(productId: string, userId?: string) {
  console.log(userId)
  try {
    const product = await readOnlyPrisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: {
            name: true,
          },
        },
        variants: {
          include: {
            sizes: true,
            images: true,
          },
        },
        wishlistItems: userId ? {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        } : false,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const productWithWishlistStatus = {
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    };

    return { success: true, product: productWithWishlistStatus };
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}



export async function getSimilarProductsByCategory(category: string, userId?: string) {
  try {
    const products = await readOnlyPrisma.product.findMany({
      where: {
        category: category,
      },
      select: {
        id: true,
        store: true,
        category: true,
        description: true,
        name: true,
        storeId: true,
        price: true,
        variants: {
          select: {
            variantImage: true,
          },
          take: 1,
        },
        wishlistItems: userId ? {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        } : false,
      },
      take: 10,
    });

    const productsWithWishlistStatus = products.map(product => ({
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    }));

    return { success: true, products: productsWithWishlistStatus };
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    return { success: false, error: "Failed to fetch similar products" };
  }
}

export async function getProductsByStoreIdForMerchant(storeId: string | null) {
  try {
    if(storeId!=null){
    const products = await readOnlyPrisma.product.findMany({
      where: {
        storeId: storeId,
      },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        variants: {
          select: {
            id: true,
            color: true,
            variantImage: true,
            sizes: {
              select: {
                id: true,
                size: true,
                stock: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    const formattedProducts = products.map(product => ({
      ...product,
      previewImage: product.variants[0]?.variantImage || null,
      availableSizes: product.variants.flatMap(variant => 
        variant.sizes.map(size => size.size)
      ).filter((value, index, self) => self.indexOf(value) === index),
      totalStock: product.variants.reduce((total, variant) => 
        total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0
      ),
    }));

    return { success: true, products: formattedProducts };
  }
  } catch (error) {
    console.error("Failed to fetch products by store ID:", error);
  }
  return { success: false, error: "Failed to fetch products for this store" };
}


export async function getProductsByStoreId(storeId: string,sort:string, userId?: string) {
  try {
    let orderByClause = {};

    switch (sort) {
      case 'price-low-high':
      orderByClause = { price: 'asc' };
      break;
      case 'price-high-low':
      orderByClause = { price: 'desc' };
      break;
    case 'new-arrivals':
    default:
      orderByClause = { createdAt: 'desc' }; // Most recent first
      break;
    }
    const products = await readOnlyPrisma.product.findMany({
      where: {
        storeId: storeId,
      },
      orderBy:orderByClause,
      select: {
        id: true,
        store: true,
        category: true,
        description: true,
        name: true,
        storeId: true,
        price: true,
        variants: {
          select: {
            variantImage: true,
          },
        },
        wishlistItems: userId ? {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        } : false,
      },
    });

    const productsWithWishlistStatus = products.map(product => ({
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    }));
    return { success: true, products: productsWithWishlistStatus };
  } catch (error) {
    console.error(`Failed to fetch products for store ${storeId}:`, error);
    return { success: false, error: "Failed to fetch products for the specified store" };
  }
}

export async function updateProduct(productData: any) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productData.id },
      data: {
        name: productData.name,
        description: productData.description,
        price: new Decimal(productData.price.toString()),
        variants: {
          update: productData.variants.map(variant => ({
            where: { id: variant.id },
            data: {
              color: variant.color,
              variantImage: variant.variantImage,
              sizes: {
                upsert: variant.sizes.map(size => ({
                  where: { id: size.id },
                  update: { stock: size.stock },
                  create: { 
                    size: size.size,
                    stock: size.stock 
                  }
                }))
              },
            },
          })),
        },
      },
    });

    revalidatePath(`/products/${productData.id}`);
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

