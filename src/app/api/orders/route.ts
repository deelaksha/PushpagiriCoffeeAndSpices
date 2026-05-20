import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Validate order data (Zod can be used here)
    if (!data.userId && !data.customerInfo) {
       return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Generate unique order ID (e.g. PCS-123456)
    const orderId = `PCS-${Date.now().toString().slice(-6)}`;

    const orderRef = await adminDb?.collection('orders').add({
      ...data,
      orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderStatus: 'processing',
      paymentStatus: 'pending' // Placeholder for Razorpay
    });

    // Optionally: Update inventory here or trigger a Firebase function

    return NextResponse.json({ id: orderRef?.id, orderId, message: 'Order created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
