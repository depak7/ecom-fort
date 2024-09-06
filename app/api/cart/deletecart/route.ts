import { NextRequest, NextResponse } from 'next/server';
import { deleteCartItem } from "@/app/actions/cart/action";

export async function DELETE(req: NextRequest) {
    try {
        const requestBody = await req.json();
        console.log("requestBody", requestBody) 

        let { cartId, cartItemId } = requestBody;

        if (!cartId || !cartItemId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }
        cartItemId = parseInt( cartItemId, 10);
        const result = await deleteCartItem( cartId, cartItemId);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting cart:', error.message);
        return NextResponse.json({ message: 'Failed to delete cart' }, { status: 500 });
    }
}