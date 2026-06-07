export function decodeRouteParam(value: string): string {
  if (!value) return ""

  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value.replace(/%20/g, " ").replace(/\+/g, " ")
  }
}
