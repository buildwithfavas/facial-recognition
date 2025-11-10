/**
 * Sanitizes a name specifically - more permissive than general input
 * Allows letters, spaces, hyphens, apostrophes, and common name characters
 * @param name - Raw name input
 * @param maxLength - Maximum allowed length (default: 50)
 * @returns Sanitized name
 */
export function sanitizeName(name: string, maxLength = 50): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Allow only letters, spaces, hyphens, apostrophes, periods, and accented characters
    .replace(/[^a-zA-Z\s\-'.À-ÿ]/g, '')
    // Remove multiple consecutive spaces
    .replace(/\s+/g, ' ')
    // Enforce max length
    .substring(0, maxLength);
}
