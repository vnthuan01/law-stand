import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const formatCurrencyVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0, // không hiển thị phần thập phân
  }).format(value);
};

// Format tiền VND rút gọn (dùng cho chart axis, small UI)
export const formatCurrencyVNDSHORT = (value: number): string => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B'; // Tỷ
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M'; // Triệu
  if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K'; // Ngàn
  return value.toString();
};

//Local time
export function getDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
