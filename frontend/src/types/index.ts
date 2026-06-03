export interface CalEvent {
  id: string;
  year: number;
  month: number;
  day: number | null;
  title: string;
  memo: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  year: number;
  month: number;
  day: number | null;
  title: string;
  memo: string;
  color: string;
}

export const COLOR_PRESETS = [
  { label: '赤', value: '#EF4444' },
  { label: 'オレンジ', value: '#F97316' },
  { label: '黄', value: '#EAB308' },
  { label: '緑', value: '#22C55E' },
  { label: 'シアン', value: '#06B6D4' },
  { label: '青', value: '#3B82F6' },
  { label: '紫', value: '#A855F7' },
  { label: 'ピンク', value: '#EC4899' },
];
