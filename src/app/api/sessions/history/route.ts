// src/app/api/sessions/history/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: "Missing Merchant UID" }, { status: 400 });
    }

    // Fetch the 10 most recent sessions for this specific merchant
    const sessionsSnap = await db.collection('sessions')
      .where('merchantId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const sessions = sessionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ status: 'success', sessions }, { status: 200 });

  } catch (error) {
    console.error("Error fetching session history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
