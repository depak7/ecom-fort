import { NextRequest, NextResponse } from 'next/server';
import { getCart } from "@/app/actions/cart/action";

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        console.log("requestBody", requestBody)

        const { userId } = requestBody;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const cart = await getCart(userId);
        return NextResponse.json({ cart }, { status: 200 });
        
    } catch (error:any) {
        console.error('Error fetching cart:', error.message);
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
}   