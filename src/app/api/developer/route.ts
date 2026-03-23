// src/app/api/developer/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import crypto from 'crypto';

// Fetch a user's existing API key
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) return NextResponse.json({ error: "Missing UID" }, { status: 400 });

  const doc = await db.collection('merchants').doc(uid).get();
  if (!doc.exists) return NextResponse.json({ merchant: null });

  return NextResponse.json({ merchant: doc.data() });
}

// Generate a brand new API key
export async function POST(request: Request) {
  try {
    const { uid, email, companyName } = await request.json();

    if (!uid || !companyName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const docRef = db.collection('merchants').doc(uid);
    const existing = await docRef.get();
    
    if (existing.exists) {
      return NextResponse.json({ error: 'API Key already exists' }, { status: 400 });
    }

    const rawKey = crypto.randomBytes(24).toString('hex');
    const apiKey = `anci_live_${rawKey}`;

    const newMerchant = {
      uid,
      email,
      companyName,
      apiKey,
      createdAt: new Date().toISOString(),
      apiCredits: 5000, // Give them free trial credits!
      status: 'active'
    };

    await docRef.set(newMerchant);

    return NextResponse.json({ status: 'success', merchant: newMerchant }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
