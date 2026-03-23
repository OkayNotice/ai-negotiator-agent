// src/lib/guardrails.ts

export interface ProductPricing {
  productId: string;
  basePrice: number;    // Absolute minimum you will accept
  ceilingPrice: number; // Maximum anchor price
}

export function enforcePriceGuardrails(
  aiProposedPrice: number,
  pricingDetails: ProductPricing
): number {
  const { basePrice, ceilingPrice } = pricingDetails;

  // 1. Hard Floor Check: Protects profit margins
  if (aiProposedPrice < basePrice) {
    console.warn(`GUARDRAIL: AI proposed ${aiProposedPrice}, below base ${basePrice}. Resetting.`);
    return basePrice;
  }

  // 2. Hard Ceiling Check: Protects customer trust
  if (aiProposedPrice > ceilingPrice) {
    console.warn(`GUARDRAIL: AI proposed ${aiProposedPrice}, above ceiling ${ceilingPrice}. Resetting.`);
    return ceilingPrice;
  }

  // 3. Safe to proceed
  return aiProposedPrice;
}
