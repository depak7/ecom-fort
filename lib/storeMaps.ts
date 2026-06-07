type StoreAddressParts = {
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  mapLink?: string | null
}

export function formatStoreAddress(parts: StoreAddressParts): string {
  const segments = [
    parts.address?.trim(),
    [parts.city?.trim(), parts.state?.trim()].filter(Boolean).join(", "),
    parts.pincode?.trim(),
  ].filter(Boolean)

  return segments.join(" · ")
}

export function formatShortStoreLocation(parts: StoreAddressParts, maxLength = 48): string {
  const full = formatStoreAddress(parts)
  if (full.length <= maxLength) return full

  const cityState = [parts.city?.trim(), parts.state?.trim()].filter(Boolean).join(", ")
  if (cityState.length <= maxLength) return cityState

  return cityState.slice(0, maxLength - 1) + "…"
}

export function getStoreMapsUrl(parts: StoreAddressParts): string | null {
  if (parts.mapLink?.trim()) return parts.mapLink.trim()

  const query = formatStoreAddress(parts)
  if (!query) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
