import { NextResponse } from 'next/server';

// Mock data - Replace with actual database call
const getMerchById = async (id: string) => ({
  id: 1,
  name: "TPC Exclusive T-shirt",
  description: "Premium cotton t-shirt with exclusive design",
  price: 43.00,
  isAvailable: true,
  remainingQuanity: 100,
  thumbnailImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  images: [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  ],
  colors: [
    { id: 1, name: "Black", hexCode: "#000000" },
    { id: 2, name: "Blue", hexCode: "#0099FF" },
    { id: 3, name: "Purple", hexCode: "#800080" },
  ],
  sizes: [
    { id: 1, size: "S" },
    { id: 2, size: "M" },
    { id: 3, size: "L" },
  ],
  variants: [
    { id: 1, sku: "TPC-BLK-S", stock: 10, additionalPrice: 0 },
    { id: 2, sku: "TPC-BLK-M", stock: 15, additionalPrice: 0 },
  ]
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const merch = await getMerchById(params.id);
    return NextResponse.json(merch);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merch details' }, { status: 500 });
  }
}