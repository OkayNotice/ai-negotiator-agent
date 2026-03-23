// src/app/api/negotiate/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, sessionId, userOffer, chatHistory = [] } = body;

    // TODO: Later, we will fetch this from Firebase using the productId
    // For now, we mock the database response to get the logic working:
    const mockDbProduct = {
      productId: productId,
      basePrice: 10000,   // Lowest acceptable price (hidden from user)
      ceilingPrice: 15000 // Starting high-anchor price
    };

    const systemPrompt = `
      You are the AI Negotiation Engine for ANCI. 
      Your goal is to negotiate a price for a product. 
      
      RULES:
      1. You must be polite, persuasive, and act like a merchant.
      2. The absolute minimum price you can accept is ${mockDbProduct.basePrice}. DO NOT accept anything below this.
      3. Do NOT reveal your minimum price.
      4. If the user's offer of ${userOffer} is acceptable, close the deal.
      
      You MUST respond in valid JSON format with exactly two keys:
      - "message": The conversational text to show the customer.
      - "proposedPrice": The numerical value of your counter-offer or accepted price.
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Lightning fast, JSON-capable model
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: `I will offer ${userOffer} for this.` }
      ],
      temperature: 0.7,
    });

    // Parse the AI's JSON response
    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    const rawAiPrice = aiResponse.proposedPrice || mockDbProduct.ceilingPrice;

    // Apply the mathematical shield
    const finalSafePrice = enforcePriceGuardrails(rawAiPrice, mockDbProduct);

    // Send the safe response back
    return NextResponse.json({
      status: "success",
      sessionId: sessionId,
      finalPrice: finalSafePrice,
      aiMessage: aiResponse.message,
      dealClosed: finalSafePrice <= userOffer 
    }, { status: 200 });

  } catch (error) {
    console.error("Negotiation API Error:", error);
    return NextResponse.json(
      { error: "Failed to process negotiation." },
      { status: 500 }
    );
  }
}
