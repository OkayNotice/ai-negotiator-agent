// src/app/api/negotiate/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';
import { db } from '@/lib/firebase-admin';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userMessage, chatHistory = [] } = body;

    if (!sessionId || !userMessage) {
      return NextResponse.json({ error: "Missing sessionId or userMessage." }, { status: 400 });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const sessionData = sessionSnap.data() as any;

    if (sessionData.status === 'closed_won') {
      return NextResponse.json({ error: "Deal is already closed." }, { status: 400 });
    }

    const { basePrice, ceilingPrice, productName } = sessionData;
    
    // 🔥 Calculate the current round! (1 user message + 1 AI response = 1 round)
    const currentRound = Math.floor(chatHistory.length / 2) + 1;

    const systemPrompt = `
      You are a witty, fast-moving human sales agent for ANCI.
      Product: ${productName}.
      
      CRITICAL RULES:
      1. KEEP IT EXTREMELY SHORT. Maximum 1 or 2 sentences. Be punchy!
      2. Your starting anchor price was ${ceilingPrice}. Your hidden absolute minimum is ${basePrice}.
      3. This is Round ${currentRound} of the negotiation. 
      4. IF THIS IS ROUND 4 OR 5: You MUST drop the games, offer a price very close to or exactly ${basePrice}, and firmly tell the user it is your "final, best offer." Force the close!
      5. Do not reveal the exact ${basePrice} before round 4.
      
      DEAL CLOSING:
      - If the user agrees to your asking price, or offers ${basePrice} or higher, close the deal!
      
      JSON FORMAT:
      {
        "message": "Your SHORT text response.",
        "proposedPrice": Numerical asking price.,
        "detectedUserOffer": Numerical user offer (or null).,
        "dealClosed": true/false
      }
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: userMessage } 
      ],
      temperature: 0.6, 
    });

    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    
    let rawAiPrice = aiResponse.proposedPrice || ceilingPrice;
    let detectedOffer = aiResponse.detectedUserOffer || 0;
    let isDealClosed = aiResponse.dealClosed === true;
    let finalMessage = aiResponse.message || "What's your best offer?";

    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, {
      productId: sessionData.merchantProductId, 
      basePrice: basePrice,
      ceilingPrice: ceilingPrice
    });

    if (isDealClosed && detectedOffer < basePrice && finalSafePrice > detectedOffer) {
      isDealClosed = false;
      finalMessage = `I can't go that low, my boss would kill me! Let's do $${finalSafePrice} as my final offer.`;
    }

    if (isDealClosed) {
      const winningPrice = (detectedOffer >= basePrice) ? detectedOffer : finalSafePrice;
      finalMessage = `Deal! Let's get this wrapped up at $${winningPrice}. 🤝`;
      finalSafePrice = winningPrice; 

      await sessionRef.update({
        finalDealPrice: finalSafePrice,
        status: 'closed_won',
        closedAt: new Date().toISOString()
      });
    } else if (detectedOffer > 0) {
      await sessionRef.update({ lastOffer: detectedOffer });
    }

    return NextResponse.json({
      status: "success", sessionId, finalPrice: finalSafePrice, aiMessage: finalMessage, dealClosed: isDealClosed 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
