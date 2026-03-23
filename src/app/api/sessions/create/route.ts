// src/app/api/sessions/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 🛡️ 1. API KEY VALIDATION (Server-to-Server Security)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized. Missing API Key." }, { status: 401 });
    }

    const apiKey = authHeader.split('Bearer ')[1];

    const merchantsSnapshot = await db.collection('merchants').where('apiKey', '==', apiKey).limit(1).get();

    if (merchantsSnapshot.empty) {
      return NextResponse.json({ error: "Invalid API Key." }, { status: 403 });
    }

    const merchant = merchantsSnapshot.docs[0];
    const merchantId = merchant.id;
    const merchantData = merchant.data(); // 🔥 Grab the merchant's profile data

    // 📦 2. PARSE THE JUST-IN-TIME PRODUCT DATA
    const body = await request.json();
    // 🔥 We extract the currency if they sent one in the request!
    const { productName, basePrice, ceilingPrice, merchantProductId, currency } = body;

    // Validate that they sent the math we need
    if (!productName || basePrice === undefined || ceilingPrice === undefined) {
      return NextResponse.json({ error: "Missing required product or price data." }, { status: 400 });
    }

    if (basePrice > ceilingPrice) {
      return NextResponse.json({ error: "Base price cannot be higher than ceiling price." }, { status: 400 });
    }

    // 🌍 3. THE CURRENCY DECISION ENGINE
    // Use the requested currency, OR the merchant's default, OR fallback to UGX
    const activeCurrency = currency || merchantData.defaultCurrency || "UGX";

    // 🔐 4. GENERATE A UNIQUE SESSION TAG (The "Vault ID")
    const sessionId = `sess_${crypto.randomBytes(12).toString('hex')}`;

    // 🗄️ 5. LOCK THE SECRET PRICES IN FIREBASE
    await db.collection('sessions').doc(sessionId).set({
      merchantId: merchantId,
      merchantProductId: merchantProductId || "unknown",
      productName: productName,
      basePrice: Number(basePrice),
      ceilingPrice: Number(ceilingPrice),
      currency: activeCurrency, // 🔥 Lock the currency into the vault!
      status: 'active',
      createdAt: new Date().toISOString(),
      chatHistory: [] 
    });

    // 🚀 6. RETURN THE TAG TO THE MERCHANT
    return NextResponse.json({
      status: "success",
      sessionId: sessionId,
      message: "Session vault created securely."
    }, { status: 201 });

  } catch (error) {
    console.error("Session Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
