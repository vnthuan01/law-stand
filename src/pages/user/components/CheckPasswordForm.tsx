// components/CheckPasswordForm.tsx
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation();
  const rules = [
    { label: t('password.atLeast8Chars'), test: (val: string) => val.trim().length >= 8 },
    { label: t('password.atLeast1Uppercase'), test: (val: string) => /[A-Z]/.test(val) },
    { label: t('password.atLeast1Lowercase'), test: (val: string) => /[a-z]/.test(val) },
    { label: t('password.atLeast1Number'), test: (val: string) => /[0-9]/.test(val) },
    { label: t('password.atLeast1Special'), test: (val: string) => /[^A-Za-z0-9]/.test(val) },
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
