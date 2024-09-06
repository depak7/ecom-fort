'use server'

import { prisma } from "@/database";

export async function addToCart(
     userId: string,
     productId: string, 
     variantId: number, 
     quantity: number,
     variantSizeId:number) {

    console.log(`Adding to cart: userId=${userId}, productId=${productId}, productVariantId=${variantId}, quantity=${quantity}`);
   
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });
   
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
              
                userId: userId,

            },
        });
        console.log(`Created new cart for userId=${userId}`);
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId, productVariantId: variantId },
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
        console.log(`Updated existing cart item: cartId=${cart.id}, productId=${productId}, productVariantId=${variantId}, newQuantity=${existingItem.quantity + quantity}`);
    } else {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { price: true },
        });
    
        if (!product) {
            console.error('Product not found');
            throw new Error('Product not found');
        }
    
        const price = product.price;
        console.log("price", price)

        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                price,
                productId,
                productVariantId:variantId,
                quantity,
                variantSizeId:variantSizeId,
            },
        });
        console.log(`Created new cart item: cartId=${cart.id}, productId=${productId}, productVariantId=${variantId}, quantity=${quantity}`);
    }
  
    return {
        message: 'Item added to cart successfully',
        data: {
            userId,
            productId,
            productVariantId:variantId,
            quantity,
        },
    };
}



export async function getCart(userId: string) {
    console.log(`Attempting to fetch cart for user: ${userId}`);
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: true,
        },
    });

    if (!cart) {
        console.error(`Cart not found for user: ${userId}`);
        throw new Error('Cart not found');
    }
    console.log("cart", cart)
    console.log(`Successfully retrieved cart for user: ${userId}`);
    return {message: 'Cart retrieved successfully', data: cart};
}



export async function deleteCartItem(cartId: string, cartItemId: number) {
   
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
    });

    if (!cart) {
        console.error(`Cart not found with id=${cartId}`);
        throw new Error('Cart not found');
    }

   
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
    });

    if (!cartItem) {
        console.error(`Cart item not found with id=${cartItemId}`);
        throw new Error('Cart item not found');
    }

 
    if (cartItem.cartId !== cartId) {
        console.error(`Cart item with id=${cartItemId} does not belong to cart with id=${cartId}`);
        throw new Error('Cart item does not belong to the specified cart');
    }

    
    await prisma.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });

    console.log(`Deleted cart item with id=${cartItemId} from cartId=${cartId}`);

    return {
        message: 'Cart item deleted successfully',
    };
}