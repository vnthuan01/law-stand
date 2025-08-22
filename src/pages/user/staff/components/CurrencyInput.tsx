import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formatCurrencyVND } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  requiredZero?: boolean;
}

function CurrencyInput({ value, onChange, placeholder, requiredZero = true }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value ? formatCurrencyVND(value) : '');

  // đồng bộ khi value thay đổi (vd: reset form)
  useEffect(() => {
    if (value === '' || value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCurrencyVND(Number(value)));
    }
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d]/g, '');
        setDisplayValue(raw); // giữ số thô để user gõ
        onChange(raw === '' ? (requiredZero ? 0 : '') : Number(raw));
      }}
      onBlur={() => {
        if (value === '' || value === undefined) {
          setDisplayValue('');
        } else {
          setDisplayValue(formatCurrencyVND(Number(value)));
        }
      }}
      onFocus={() => {
        const raw = (value ?? '').toString().replace(/[^\d]/g, '');
        setDisplayValue(raw);
      }}
      className="mt-1 w-full"
      placeholder={placeholder}
    />
  );
}

interface CurrencyInputControllerProps {
  control: any;
  name: string;
  placeholder?: string;
  requiredZero?: boolean;
  error?: string;
  label: string;
}

export function CurrencyInputController({
  control,
  name,
  placeholder,
  requiredZero = true,
  error,
  label,
}: CurrencyInputControllerProps) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CurrencyInput
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            requiredZero={requiredZero}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
