import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from "@/app/actions/cart/action";


export async function POST(req: NextRequest) {
    try {   
        const requestBody = await req.json();
        console.log("requestBody", requestBody)

        let {userId, productId,productVariantId, quantity,variantSizeId} = requestBody;

        if(!userId || !productId || !productVariantId || !quantity || !variantSizeId){

            console.log("Missing required fields")
            return NextResponse.json(
                { code:400, message: "Missing required fields"},
                { status: 400 }
            );
        }

        productVariantId = parseInt(productVariantId, 10);
        quantity = parseInt(quantity, 10);
        
        const result = await addToCart(userId, productId, productVariantId, quantity, variantSizeId);
        console.log("result", result)

        return NextResponse.json(
            { code:200, message: result.message, data: result.data},
            { status: 200 }
        );
        
    } catch (error:any) {
        console.log("error", error)
        return NextResponse.json(
            { code:500, message: error.message},
            { status: 500 }
        );    
    }
}
