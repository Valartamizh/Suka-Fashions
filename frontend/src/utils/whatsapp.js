/**
 * WhatsApp Helper Utilities for Suka Fashions
 */

export const DEFAULT_STORE_PHONE = '+91 9488463850';

/**
 * Normalizes any phone number or wa.me link into a clean digits string with country code (91)
 * E.g., "+91 9488463850" -> "919488463850"
 * E.g., "9488463850" -> "919488463850"
 * E.g., "https://wa.me/919488463850" -> "919488463850"
 */
export const cleanWhatsAppNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '919488463850';
  }

  // If old dummy placeholder number is passed, redirect to store's default phone
  if (phone.includes('9876543210') || phone.includes('98765 43210') || phone.includes('9876500000')) {
    return '919488463850';
  }

  // If already in wa.me/ format
  if (phone.includes('wa.me/')) {
    const match = phone.match(/wa\.me\/([0-9]+)/);
    if (match && match[1]) {
      const num = match[1];
      if (num.includes('9876543210')) return '919488463850';
      return num;
    }
  }

  // Extract all digits
  let digits = phone.replace(/\D/g, '');

  // Strip leading zero if present
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  // If 10 digits (standard Indian mobile without country code)
  if (digits.length === 10) {
    digits = '91' + digits;
  }

  return digits || '919488463850';
};

/**
 * Generates a full WhatsApp Web/App direct link
 */
export const getWhatsAppUrl = (phone, text = '') => {
  const cleanNumber = cleanWhatsAppNumber(phone);
  if (!text) {
    return `https://wa.me/${cleanNumber}`;
  }
  // Check if text is already URI encoded
  const isEncoded = /%[0-9A-Fa-f]{2}/.test(text);
  const encodedText = isEncoded ? text : encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};
