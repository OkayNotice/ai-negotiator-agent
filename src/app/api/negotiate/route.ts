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
    // 1. CHANGED: We now accept the raw text string 'userMessage', not a strict number
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

    // 🧠 2. THE NEW, WITTY AI PROMPT
    const systemPrompt = `
      You are a charismatic, witty, and highly persuasive human sales agent for ANCI.
      You are currently negotiating the price of a: ${productName}.
      
      CONVERSATION RULES:
      1. You are human! Use natural language, crack jokes, be empathetic, use occasional emojis, and respond naturally to phrases like "okay", "no", "yes", or "that's too expensive".
      2. If the user is just chatting or complaining, chat back gently but steer them towards making an offer.
      3. Your starting anchor price is ${ceilingPrice}. 
      4. Your hidden absolute minimum price is ${basePrice}. NEVER reveal this exact number unless the user guesses it.
      5. Negotiate GRADUALLY. If they lowball you, reject it playfully (e.g., "Haha my boss would fire me!"), and state a specific counter-offer.
      
      DEAL CLOSING RULES:
      - If the user explicitly agrees to your current asking price, the deal is closed.
      - If the user makes an offer that is ${basePrice} or higher, accept it enthusiastically!
      
      You MUST respond in valid JSON format with exactly four keys:
      {
        "message": "Your conversational text response (include your $ counter-offer if rejecting).",
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
        // Send their exact raw text to the brain!
        { role: "user", content: userMessage } 
      ],
      // Slightly higher temperature (0.6) allows the AI to be more creative and funny
      temperature: 0.6, 
    });

    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    
    let rawAiPrice = aiResponse.proposedPrice || ceilingPrice;
    let detectedOffer = aiResponse.detectedUserOffer || 0;
    let isDealClosed = aiResponse.dealClosed === true;
    let finalMessage = aiResponse.message || "I didn't quite catch that, what's your offer?";

    // 🛡️ 3. MATHEMATICAL GUARDRAILS (Protecting the bottom line)
    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, {
      productId: sessionData.merchantProductId, 
      basePrice: basePrice,
      ceilingPrice: ceilingPrice
    });

    // 🔥 4. SECURITY CHECK: Did the AI hallucinate a bad deal?
    if (isDealClosed && detectedOffer < basePrice && finalSafePrice > detectedOffer) {
      // The AI tried to accept a deal below the floor price. Override it!
      isDealClosed = false;
      finalMessage = `I'd love to say yes to $${detectedOffer}, but my boss would actually lock me out of the building. How about we meet in the middle at $${finalSafePrice}?`;
    }

    // 💾 5. UPDATE THE SESSION VAULT
    if (isDealClosed) {
      // If they offered higher than the floor, we take their offer! Otherwise we take the agreed safe price.
      const winningPrice = (detectedOffer >= basePrice) ? detectedOffer : finalSafePrice;
      
      finalMessage = `You know what? Deal! Let's get this ${productName} wrapped up at $${winningPrice}.`;
      finalSafePrice = winningPrice; 

      await sessionRef.update({
        finalDealPrice: finalSafePrice,
        status: 'closed_won',
        closedAt: new Date().toISOString(),
        lastOffer: detectedOffer || finalSafePrice
      });
    } else if (detectedOffer > 0) {
      // Just log their latest numerical offer
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
