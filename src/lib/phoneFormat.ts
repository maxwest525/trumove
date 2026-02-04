// Phone number formatting utility
// Formats as (XXX) XXX-XXXX as user types

export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limited = digits.slice(0, 10);
  
  // Format based on length
  if (limited.length === 0) return '';
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

export function getDigitsOnly(formattedPhone: string): string {
  return formattedPhone.replace(/\D/g, '');
}

export function isValidPhoneNumber(formattedPhone: string): boolean {
  const digits = getDigitsOnly(formattedPhone);
  return digits.length === 10;
}
