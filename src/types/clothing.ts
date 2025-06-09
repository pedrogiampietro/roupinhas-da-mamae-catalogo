
export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  description?: string;
  image_url?: string;
  status: 'available' | 'sold';
  created_at: string;
  sold_at?: string;
}

export type ClothingCategory = 
  | 'blusa'
  | 'calca'
  | 'vestido'
  | 'saia'
  | 'jaqueta'
  | 'acessorio'
  | 'calcado'
  | 'outros';

export const CLOTHING_CATEGORIES: { value: ClothingCategory; label: string }[] = [
  { value: 'blusa', label: 'Blusa' },
  { value: 'calca', label: 'Calça' },
  { value: 'vestido', label: 'Vestido' },
  { value: 'saia', label: 'Saia' },
  { value: 'jaqueta', label: 'Jaqueta' },
  { value: 'acessorio', label: 'Acessório' },
  { value: 'calcado', label: 'Calçado' },
  { value: 'outros', label: 'Outros' },
];

export const CLOTHING_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
