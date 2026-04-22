export const BRAND = {
  blue: '#0F3A7A',
  blueDark: '#0B2E62',
  blueDeep: '#0A2955',
  yellow: '#FFE81A',
  yellowDark: '#F5D800',
  softBlue: '#EFF4FB',
  softPeach: '#FBF2EC',
  text: '#1A1A1A',
  textLight: '#4B5563',
  border: '#E5E7EB',
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatSalary(n: string | number): string {
  if (!n) return '';
  const num = parseInt(String(n).replace(/\D/g, ''));
  if (isNaN(num)) return String(n);
  return num.toLocaleString('nl-NL').replace(/,/g, '.');
}

export function generateReference(): string {
  return `${Math.floor(100000 + Math.random() * 900000)}-A`;
}
