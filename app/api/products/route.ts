import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/app/actions/products/action';

export async function GET(req: NextRequest) {

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const result = await getProductById(id);
    console.log(result)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ product: result.product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}