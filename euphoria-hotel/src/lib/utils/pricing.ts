const VAT_RATE = 0.075 // 7.5%

export function calculateSubtotal(pricePerNightKobo: number, nights: number): number {
  return pricePerNightKobo * nights
}

export function calculateVAT(subtotalKobo: number, rate = VAT_RATE): number {
  return Math.round(subtotalKobo * rate)
}

export function calculateTotal(subtotalKobo: number, vatKobo: number): number {
  return subtotalKobo + vatKobo
}

export function buildPricingBreakdown(pricePerNightKobo: number, nights: number) {
  const subtotal = calculateSubtotal(pricePerNightKobo, nights)
  const vat = calculateVAT(subtotal)
  const total = calculateTotal(subtotal, vat)
  return { subtotal, vat, total, nights, pricePerNight: pricePerNightKobo }
}
