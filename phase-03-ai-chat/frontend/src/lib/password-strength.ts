export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrength {
  level: StrengthLevel;
  score: number;
  label: string;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: 'weak', score: 0, label: '' };

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const charTypes = [hasLowercase, hasUppercase, hasDigit, hasSymbol].filter(Boolean).length;
  const length = password.length;

  if (length < 6 || charTypes <= 1) return { level: 'weak', score: 1, label: 'Weak' };
  if (length >= 10 && charTypes === 4) return { level: 'strong', score: 4, label: 'Strong' };
  if (length >= 8 && charTypes >= 3) return { level: 'good', score: 3, label: 'Good' };
  return { level: 'fair', score: 2, label: 'Fair' };
}
