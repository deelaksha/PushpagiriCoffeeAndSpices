import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    // Basic secret check to allow initial admin setup, or verify existing admin
    const { email, role, secret } = await req.json();

    // WARNING: In production, use a strong environment variable for initial setup
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      // If not using secret, verify the requestor is already an admin
       const authHeader = req.headers.get('Authorization');
       if (!authHeader?.startsWith('Bearer ')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
       }
       const idToken = authHeader.split('Bearer ')[1];
       const decodedToken = await adminAuth?.verifyIdToken(idToken);
       if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

       const requestor = await adminDb?.collection('users').doc(decodedToken.uid).get();
       if (requestor?.data()?.role !== 'admin') {
           return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
       }
    }

    // Find user by email
    const userRecord = await adminAuth?.getUserByEmail(email);
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Set custom claim (optional, for Firebase Auth token rules)
    await adminAuth?.setCustomUserClaims(userRecord.uid, { admin: role === 'admin' });

    // Update Firestore
    await adminDb?.collection('users').doc(userRecord.uid).set({
      email,
      role: role || 'user',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ message: `User ${email} role updated to ${role}` });
  } catch (error) {
    console.error('Error updating admin role:', error);
    return NextResponse.json({ error: 'Failed to update admin role' }, { status: 500 });
  }
}
