"use server";


import  prisma  from "@/database/index";
import { revalidatePath } from "next/cache";
import { readOnlyPrisma } from "@/database/index";
import Decimal from "decimal.js";
import { z } from 'zod';



const ProductFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  brand: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  productImage: z.string().url('Valid image URL is required'),
  storeId:z.string(),
  variants: z.array(
    z.object({
      color: z.string().min(1, 'Color is required'),
      variantImage: z.string().url('Valid variant image URL is required'),
      images: z.array(z.string().url('Valid image URL is required')).optional(),
      sizes: z.array(
        z.object({
          size: z.string().min(1, 'Size is required'),
          stock: z.number().int().positive('Stock must be positive')
        })
      ).min(1, 'At least one size is required')
    })
  ).min(1, 'At least one variant is required')
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

export async function createProduct(data: ProductFormData) {
  try {
 
    const validatedData = ProductFormSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Invalid form data',
        errors: validatedData.error.errors
      };
    }

    // Create product with variants and sizes
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        brand: data.brand || null,
        category: data.category || null,
        price: data.price,
        productImage: data.productImage,
        storeId: data.storeId,
        variants: {
          create: data.variants.map(variant => ({
            color: variant.color,
            variantImage: variant.variantImage,
            sizes: {
              create: variant.sizes.map(size => ({
                size: size.size,
                stock: size.stock
              }))
            },
            images: variant.images && variant.images.length > 0 ? {
              create: variant.images.map(imageUrl => ({
                url: imageUrl
              }))
            } : undefined
          }))
        }
      }
    });

    revalidatePath('/products');
    
    return {
      success: true,
      message: 'Product created successfully',
      productId: product.id
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create product'
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    // Step 1: Find all variant IDs of the product
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      select: { id: true },
    });
    const variantIds = variants.map(v => v.id);

    // Step 2: Delete VariantSize
    await prisma.variantSize.deleteMany({
      where: {
        variantId: { in: variantIds },
      },
    });

    // Step 3: Delete ProductImage
    await prisma.productImage.deleteMany({
      where: {
        variantId: { in: variantIds },
      },
    });

    // Step 4: Delete cart and wishlist items tied to variants
    await prisma.cartItem.deleteMany({
      where: {
        OR: [
          { productVariantId: { in: variantIds } },
          { productId },
        ],
      },
    });
    await prisma.wishlistItem.deleteMany({
      where: {
        OR: [
          { productVariantId: { in: variantIds } },
          { productId },
        ],
      },
    });

    // Step 5: Delete ProductVariants
    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    // Step 6: Delete order items and reviews related to product
    await prisma.orderItem.deleteMany({
      where: { productId },
    });
    await prisma.review.deleteMany({
      where: { productId },
    });

    // Step 7: Delete the Product
    const product = await prisma.product.delete({
      where: { id: productId },
      include: { store: true },
    });

    revalidatePath(`/merchant/storedetails`);
    return { success: true, message: "Product and all related data deleted successfully" };
  } catch (error) {
    console.error("Failed to delete product deeply:", error);
    return { success: false, error: "Failed to delete product and related data" };
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
        productImage:true,
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
        productImage:true,
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
        productImage:true,
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


