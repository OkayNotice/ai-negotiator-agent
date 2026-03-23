// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// Protect against Vercel trying to initialize multiple times
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Crucial: Vercel sometimes escapes the newlines in private keys, this fixes it
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('🔥 Firebase Admin Initialized');
  } catch (error) {
    console.error('Firebase Admin Error:', error);
  }
}

export const db = admin.firestore();
