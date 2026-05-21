import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { doc, collection, runTransaction, serverTimestamp, increment } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Validate incoming data
    if (!data.userId && !data.customerInfo) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 2. Generate unique order ID
    const orderId = `PCS-${Date.now().toString().slice(-6)}`;
    const newOrderRef = doc(collection(db, 'orders')); // Auto-generate document ID

    // 3. Execute Firestore Transaction using Client SDK
    await runTransaction(db, async (t) => {
      // --- A. Read all product documents to check stock ---
      const requestedQuantities: Record<string, number> = {};
      data.products.forEach((item: any) => {
        const pId = item.product?.id || item.productId;
        if (!pId) return;
        requestedQuantities[pId] = (requestedQuantities[pId] || 0) + (item.quantity || 1);
      });

      const productIds = Object.keys(requestedQuantities);
      if (productIds.length === 0) {
        throw new Error("No valid products found in order");
      }

      // In client SDK, we can't do t.getAll(). We must do a loop of t.get()
      const productDocs = await Promise.all(
        productIds.map(id => t.get(doc(db, 'products', id)))
      );

      // --- B. Verify stock availability ---
      productDocs.forEach((productDoc, index) => {
        if (!productDoc.exists()) {
          return; // Skip dummy products
        }
        const productData = productDoc.data();
        const requestedQty = requestedQuantities[productIds[index]];
        
        if ((productData?.stock || 0) < requestedQty) {
          throw new Error(`Insufficient stock for ${productData?.name || 'a product'}. Only ${productData?.stock || 0} left.`);
        }
      });

      // --- C. Deduct stock ---
      productDocs.forEach((productDoc, index) => {
        if (!productDoc.exists()) return; // Skip stock deduction for dummy products

        const requestedQty = requestedQuantities[productIds[index]];
        t.update(productDoc.ref, {
          stock: increment(-requestedQty),
          updatedAt: serverTimestamp()
        });
      });

      // --- D. Create the Order ---
      t.set(newOrderRef, {
        ...data,
        orderId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        orderStatus: 'processing',
        paymentStatus: 'pending' 
      });

      // --- E. Empty Cart & Update User Metrics (if logged in) ---
      if (data.userId && data.userId !== "guest") {
        const userUid = data.userId;
        
        // Clear the user's cart
        const cartRef = doc(db, 'carts', userUid);
        t.set(cartRef, { 
          uid: userUid, 
          items: [], 
          updatedAt: serverTimestamp() 
        }, { merge: true });

        // Increment user's total spend and order count
        const userRef = doc(db, 'users', userUid);
        t.set(userRef, {
          totalOrders: increment(1),
          totalSpent: increment(data.total || 0),
          lastOrderDate: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    });

    return NextResponse.json({ 
      id: newOrderRef.id, 
      orderId, 
      message: 'Order created and stock deducted successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in checkout transaction:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process checkout transaction' 
    }, { status: 500 });
  }
}
