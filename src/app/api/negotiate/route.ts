// src/app/api/negotiate/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, sessionId, userOffer, chatHistory = [] } = body;

    const mockDbProduct = {
      productId: productId,
      basePrice: 10000,   // Lowest acceptable price (hidden from user)
      ceilingPrice: 15000 // Starting high-anchor price
    };

    const systemPrompt = `
      You are a strict but polite AI merchant for ANCI.
      The user is trying to buy a product. Your goal is to get the highest price possible.
      
      CRITICAL RULES:
      1. Your ABSOLUTE MINIMUM accepted price is ${mockDbProduct.basePrice}. 
      2. If the user offers less than ${mockDbProduct.basePrice}, YOU MUST REJECT IT. Counter-offer with a number higher than their offer.
      3. NEVER reveal your minimum price.
      4. If the user's offer is ${mockDbProduct.basePrice} or higher, you may accept it.
      
      Respond in valid JSON format with exactly two keys:
      - "message": Your response to the customer.
      - "proposedPrice": The number value of your counter-offer (or accepted price).
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: `I offer $${userOffer}.` }
      ],
      temperature: 0.3, // 🔥 Lowered from 0.7 to 0.3 to make the AI strict and logical
    });

    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    const rawAiPrice = aiResponse.proposedPrice || mockDbProduct.ceilingPrice;

    // Apply the mathematical shield
    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, mockDbProduct);
    let finalMessage = aiResponse.message;

    // 🔥 THE MOUTH-TO-BRAIN ALIGNMENT CHECK 🔥
    // If the AI tried to accept a price below our floor, we intercept and overwrite its message.
    if (rawAiPrice < mockDbProduct.basePrice) {
      finalSafePrice = mockDbProduct.ceilingPrice - 1000; // Counter-offer strictly
      finalMessage = `I appreciate the offer of $${userOffer}, but I simply cannot go that low. The best I can do right now is $${finalSafePrice}.`;
    }

    // Determine if the deal is officially closed based on the user's actual offer
    const isDealClosed = finalSafePrice <= userOffer;

    if (isDealClosed) {
      finalMessage = `We have a deal at $${userOffer}. Let's get this wrapped up!`;
      finalSafePrice = userOffer; // Lock the checkout price to exactly what they offered
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
      { error: "Failed to process negotiation." },
      { status: 500 }
    );
  }
}
