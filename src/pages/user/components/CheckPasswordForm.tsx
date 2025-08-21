// components/CheckPasswordForm.tsx
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const rules = [
    { label: 'At least 8 characters', test: (val: string) => val.trim().length >= 8 },
    { label: 'At least 1 uppercase letter', test: (val: string) => /[A-Z]/.test(val) },
    { label: 'At least 1 lowercase letter', test: (val: string) => /[a-z]/.test(val) },
    { label: 'At least 1 number', test: (val: string) => /[0-9]/.test(val) },
    { label: 'At least 1 special character', test: (val: string) => /[^A-Za-z0-9]/.test(val) },
  ];

  return (
    <ul className="mt-2 space-y-1 text-sm">
      {rules.map((rule, idx) => {
        const valid = rule.test(password ?? '');
        return (
          <li
            key={idx}
            className={`flex items-center gap-2 ${valid ? 'text-green-600' : 'text-gray-400'}`}
          >
            {valid ? <Check size={16} /> : <X size={16} />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
