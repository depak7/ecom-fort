"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/database/index";
import { getStoreById } from "../store/action";

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  productVariantId?: number,
  variantSizeId?: number
) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        productVariantId,
        variantSizeId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          productVariantId,
          variantSizeId,
          quantity,
          price: product.price,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function getCartItems(userId: string) {
  if (!userId) {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: {
                  select: {
                    name: true,
                  },
                },
                wishlistItems: {
                  where: {
                    wishlist: {
                      userId: userId,
                    },
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
            productVariant: {
              include: {
                images: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
                sizes: {
                  select: {
                    id: true,
                    size: true,
                  },
                },
              },
            },
            variantSize: true,
          },
        },
      },
    });

    if (!cart) {
      return { items: [], totalQuantity: 0, totalPrice: 0 };
    }

    const items = cart.items.map((item:any) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
      },
      store: {
        id: item.product.storeId,
        name: item.product.store.name,
      },
      variant: item.productVariant
        ? {
            id: item.productVariant.id,
            image: item.productVariant.images[0]?.url || null,
            availableSizes: item.productVariant.sizes.map((size:any) => ({
              name: size.size,
              id: size.id,
            })),
          }
        : null,
      size: item.variantSize
        ? {
            id: item.variantSize.id,
            name: item.variantSize.size,
          }
        : null,
      isWishlisted: item.product.wishlistItems.length > 0,
    }));

    const totalQuantity = items.reduce((sum:number, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.price.toNumber(),
      0
    );

    return {
      items,
      totalQuantity,
      totalPrice,
    };
  } catch (error) {
    console.error("Error retrieving cart items:", error);
  }
  return { items: [], totalQuantity: 0, totalPrice: 0 };
}


export async function removeFromCart(userId: string, cartItemId: number) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error("Cart item not found or doesn't belong to the user");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: number,
  quantity: number,
  sizeid?: number
) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error("Cart item not found or doesn't belong to the user");
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity,
          variantSizeId: sizeid,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "Failed to update cart item quantity" };
  }
}



export async function addAddress(userId: string, addressData: {
  name: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}) {
  try {
    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, NOT: { id: newAddress.id } },
        data: { isDefault: false },
      });
    }

    revalidatePath('/cart/address');
    return { success: true, address: newAddress };
  } catch (error) {
    console.error('Failed to add address:', error);
    return { success: false, error: 'Failed to add address' };
  }
}

export async function getUserAddresses(userId: string) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return { success: true, addresses };
  } catch (error) {
    console.error("Error retrieving user addresses:", error);
    return { success: false, error: "Failed to retrieve addresses" };
  }
}

export async function getDefaultUserAddresses(userId: string) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const addresses = await prisma.address.findFirst({
      where: { userId ,isDefault:true},
    });

    return { addresses };
  } catch (error) {
    console.error("Error retrieving user addresses:", error);
    return { success: false, error: "Failed to retrieve addresses" };
  }
}

export async function editAddress(addressId: number, addressData: {
  name?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}) {
  try {
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });

    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: updatedAddress.userId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    revalidatePath('/cart/address');
    return { success: true, address: updatedAddress };
  } catch (error) {
    console.error('Failed to edit address:', error);
    return { success: false, error: 'Failed to edit address' };
  }
}

export async function deleteAddress(addressId: number) {
  try {
    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    if (deletedAddress.isDefault) {
      const newDefaultAddress = await prisma.address.findFirst({
        where: { userId: deletedAddress.userId },
      });
      if (newDefaultAddress) {
        await prisma.address.update({
          where: { id: newDefaultAddress.id },
          data: { isDefault: true },
        });
      }
    }
    revalidatePath('/cart/address');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete address:', error);
    return { success: false, error: 'Failed to delete address' };
  }
}



export async function getCartItemsByStore(userId: string) {
  if (!userId) {
    throw new Error("User not authenticated")
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                wishlistItems: {
                  where: {
                    wishlist: {
                      userId: userId,
                    },
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
            productVariant: {
              include: {
                images: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
                sizes: {
                  select: {
                    id: true,
                    size: true,
                  },
                },
              },
            },
            variantSize: true,
          },
        },
      },
    })

    if (!cart) {
      return { stores: [], totalQuantity: 0, totalPrice: 0 }
    }

    const storesMap = new Map()

    for (const item of cart.items) {
      const storeId = item.product.store.id

      const storeDetails = await getStoreById(storeId)

      const storeData = storesMap.get(storeId) || {
        id: storeId,
        phoneNumber: storeDetails.store?.phoneNumber || "",
        name: item.product.store.name,
        items: [],
      }

      storeData.items.push({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
        },
        variant: item.productVariant
          ? {
              id: item.productVariant.id,
              image: item.productVariant.images[0]?.url || null,
              availableSizes: item.productVariant.sizes.map((size) => ({
                name: size.size,
                id: size.id,
              })),
            }
          : null,
        size: item.variantSize
          ? {
              id: item.variantSize.id,
              name: item.variantSize.size,
            }
          : null,
        isWishlisted: item.product.wishlistItems.length > 0,
      })

      storesMap.set(storeId, storeData)
    }

    const stores = Array.from(storesMap.values())

    const totalQuantity = stores.reduce(
      (sum, store) => sum + store.items.reduce((storeSum: number, item: any) => storeSum + item.quantity, 0),
      0
    )

    const totalPrice = stores.reduce(
      (sum, store) =>
        sum +
        store.items.reduce((storeSum: number, item: any) => storeSum + item.quantity * item.price.toNumber(), 0),
      0
    )

    return {
      stores,
      totalQuantity,
      totalPrice,
    }
  } catch (error) {
    console.error("Error retrieving cart items by store:", error)
    throw new Error("Failed to retrieve cart items by store")
  }
}