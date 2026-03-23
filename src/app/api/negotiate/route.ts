// src/app/api/negotiate/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';
import { db } from '@/lib/firebase-admin';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
      return NextResponse.json({ error: "Session not found or expired." }, { status: 404 });
    }

    const sessionData = sessionSnap.data() as any;

    if (sessionData.status === 'closed_won') {
      return NextResponse.json({ error: "This deal has already been closed." }, { status: 400 });
    }

    const { basePrice, ceilingPrice, productName } = sessionData;

    // 🧠 THE NEW, PUNCHY AI PROMPT
    const systemPrompt = `
      You are a charismatic, witty human sales agent for ANCI.
      You are negotiating the price of a: ${productName}.
      
      CONVERSATION RULES:
      1. KEEP IT EXTREMELY SHORT. Maximum 1 or 2 sentences per reply. You are in a small chat widget, do not write paragraphs. Be quick and punchy!
      2. Crack quick jokes, use occasional emojis, and respond naturally to phrases like "okay", "no", "yes".
      3. Your starting anchor price is ${ceilingPrice}. 
      4. Your hidden absolute minimum price is ${basePrice}. NEVER reveal this exact number.
      5. Negotiate GRADUALLY. If they lowball you, reject it playfully in one sentence, and state your specific counter-offer in the next.
      
      DEAL CLOSING RULES:
      - If the user explicitly agrees to your current asking price, the deal is closed.
      - If the user makes an offer that is ${basePrice} or higher, accept it enthusiastically!
      
      You MUST respond in valid JSON format with exactly four keys:
      {
        "message": "Your SHORT, punchy text response (include your $ counter-offer if rejecting).",
        "proposedPrice": The number value of your current asking price.,
        "detectedUserOffer": The number value the user offered (use null if they didn't include a number).,
        "dealClosed": true ONLY if you and the user have agreed on a final price, otherwise false.
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
    let finalMessage = aiResponse.message || "I didn't quite catch that, what's your offer?";

    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, {
      productId: sessionData.merchantProductId, 
      basePrice: basePrice,
      ceilingPrice: ceilingPrice
    });

    if (isDealClosed && detectedOffer < basePrice && finalSafePrice > detectedOffer) {
      isDealClosed = false;
      finalMessage = `I can't go to $${detectedOffer}, my boss would kill me! Let's do $${finalSafePrice} and call it a day.`;
    }

    if (isDealClosed) {
      const winningPrice = (detectedOffer >= basePrice) ? detectedOffer : finalSafePrice;
      finalMessage = `Deal! Let's get this wrapped up at $${winningPrice}. 🤝`;
      finalSafePrice = winningPrice; 

      await sessionRef.update({
        finalDealPrice: finalSafePrice,
        status: 'closed_won',
        closedAt: new Date().toISOString(),
        lastOffer: detectedOffer || finalSafePrice
      });
    } else if (detectedOffer > 0) {
      await sessionRef.update({ lastOffer: detectedOffer });
    }

    return NextResponse.json({
      status: "success",
      sessionId: sessionId,
      finalPrice: finalSafePrice,
      aiMessage: finalMessage,
      dealClosed: isDealClosed 
    }, { status: 200 });

  } catch (error) {
    console.error("Negotiation API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
