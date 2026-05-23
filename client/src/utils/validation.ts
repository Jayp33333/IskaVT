const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
