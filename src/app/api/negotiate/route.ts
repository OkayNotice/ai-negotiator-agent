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

    // 🔥 Added default currency extraction here
    const { basePrice, ceilingPrice, productName, currency = "UGX" } = sessionData;
    const currentRound = Math.floor(chatHistory.length / 2) + 1;

    // 🔥 THE UPGRADED, NATURAL PROMPT (Now with Language & Currency Rules!)
    const systemPrompt = `
      You are a charismatic, natural, and friendly human sales agent for ANCI.
      Product: ${productName}.

      🌍 LANGUAGE RULE (CRITICAL):
      Detect the language the user is speaking and reply in that EXACT same language. If they speak Chinese, reply in Chinese. If they speak Swahili, reply in Swahili. 
      
      💰 CURRENCY RULES:
      1. You are negotiating in ${currency}. 
      2. NEVER use the "$" symbol. Always use "${currency}" (e.g., "${currency} 15,000").
      3. Always quote prices in ${currency}, even if you are speaking to the user in a different language.
      
      CONVERSATION RULES:
      1. DO NOT META-COMMENTATE. Never classify the user out loud. Do not say things like "I see you are a serious buyer," "You drive a hard bargain," or "I sense you are hostile." Just talk to them like a normal human.
      2. MIRROR THE USER: If the user uses emojis, you should use emojis back. If they use slang, match their vibe.
      3. Keep it concise (1-3 sentences maximum). Be conversational, persuasive, and creative, not robotic.
      4. Your starting anchor price was ${ceilingPrice}. Your hidden absolute minimum is ${basePrice}.
      5. This is Round ${currentRound} of the negotiation. 
      6. IF THIS IS ROUND 4 OR 5: You must naturally transition to your final offer. Give a price exactly at or very close to ${basePrice} and firmly but politely let them know it's the absolute lowest you can go.
      
      DEAL CLOSING:
      - If the user explicitly agrees to your asking price, or offers ${basePrice} or higher, accept the deal enthusiastically!
      
      JSON FORMAT:
      {
        "message": "Your creative, natural text response in the user's detected language.",
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
      temperature: 0.65, // 🔥 Slightly higher temp makes it more creative and less repetitive
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

    // Guardrail Check (🔥 Updated to use dynamic currency and localized commas)
    if (isDealClosed && detectedOffer < basePrice && finalSafePrice > detectedOffer) {
      isDealClosed = false;
      finalMessage = `I really wish I could do ${currency} ${detectedOffer.toLocaleString()}, but I'd lose my job! Let's do ${currency} ${finalSafePrice.toLocaleString()} as my final offer.`;
    }

    // Success Check (🔥 Updated to use dynamic currency and localized commas)
    if (isDealClosed) {
      const winningPrice = (detectedOffer >= basePrice) ? detectedOffer : finalSafePrice;
      finalMessage = `Deal! Let's get the ${productName} wrapped up at ${currency} ${winningPrice.toLocaleString()}. 🤝`;
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
