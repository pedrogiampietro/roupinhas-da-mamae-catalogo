
import { useState, useEffect } from 'react';
import { ClothingItem } from '@/types/clothing';

const STORAGE_KEY = 'clothing-catalog';

// Dados de exemplo para começar
const sampleData: ClothingItem[] = [
  {
    id: '1',
    name: 'Blusa Floral Rosa',
    category: 'blusa',
    size: 'M',
    color: 'Rosa',
    price: 45.00,
    description: 'Blusa floral delicada, perfeita para o verão',
    status: 'available',
    createdAt: new Date('2024-05-01'),
  },
  {
    id: '2',
    name: 'Calça Jeans Skinny',
    category: 'calca',
    size: 'G',
    color: 'Azul',
    price: 89.90,
    description: 'Calça jeans de cintura alta, muito confortável',
    status: 'available',
    createdAt: new Date('2024-05-02'),
  },
  {
    id: '3',
    name: 'Vestido Midi Preto',
    category: 'vestido',
    size: 'P',
    color: 'Preto',
    price: 120.00,
    description: 'Vestido elegante para ocasiões especiais',
    status: 'sold',
    createdAt: new Date('2024-04-28'),
    soldAt: new Date('2024-05-05'),
  },
];

export function useClothingStore() {
  const [items, setItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedItems = JSON.parse(stored).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        soldAt: item.soldAt ? new Date(item.soldAt) : undefined,
      }));
      setItems(parsedItems);
    } else {
      setItems(sampleData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    }
  }, []);

  const saveToStorage = (newItems: ClothingItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const newItems = [...items, newItem];
    saveToStorage(newItems);
  };

  const updateItem = (id: string, updates: Partial<ClothingItem>) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToStorage(newItems);
  };

  const markAsSold = (id: string) => {
    updateItem(id, { status: 'sold', soldAt: new Date() });
  };

  const markAsAvailable = (id: string) => {
    updateItem(id, { status: 'available', soldAt: undefined });
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    saveToStorage(newItems);
  };

  const getStats = () => {
    const available = items.filter(item => item.status === 'available');
    const sold = items.filter(item => item.status === 'sold');
    const totalValue = available.reduce((sum, item) => sum + item.price, 0);
    const soldValue = sold.reduce((sum, item) => sum + item.price, 0);

    return {
      total: items.length,
      available: available.length,
      sold: sold.length,
      totalValue,
      soldValue,
    };
  };

  return {
    items,
    addItem,
    updateItem,
    markAsSold,
    markAsAvailable,
    deleteItem,
    getStats,
  };
}
