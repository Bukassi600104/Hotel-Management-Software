const VAT_RATE = 0.075 // 7.5%

export function calculateSubtotal(pricePerNightNaira: number, nights: number): number {
  return pricePerNightNaira * nights
}

export function calculateVAT(subtotalNaira: number, rate = VAT_RATE): number {
  return Math.round(subtotalNaira * rate)
}

export function calculateTotal(subtotalNaira: number, vatNaira: number): number {
  return subtotalNaira + vatNaira
}

export function buildPricingBreakdown(pricePerNightNaira: number, nights: number) {
  const subtotal = calculateSubtotal(pricePerNightNaira, nights)
  const vat = calculateVAT(subtotal)
  const total = calculateTotal(subtotal, vat)
  return { subtotal, vat, total, nights, pricePerNight: pricePerNightNaira }
}
