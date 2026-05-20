import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

// Helper to verify admin token
const verifyAdmin = async (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth?.verifyIdToken(idToken);
    if (!decodedToken) return false;

    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (userDoc?.exists && userDoc.data()?.role === 'admin') {
      return true;
    }
  } catch (error) {
    console.error('Error verifying admin:', error);
  }
  return false;
};

export async function GET(req: NextRequest) {
  try {
    const productsSnapshot = await adminDb?.collection('products').get();
    const products = productsSnapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.json();
    const newProductRef = await adminDb?.collection('products').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: newProductRef?.id, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
