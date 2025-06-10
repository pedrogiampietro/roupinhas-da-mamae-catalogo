
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClothingItem } from '@/types/clothing';

export function useClothingStore() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion para garantir que os dados do Supabase correspondem ao tipo ClothingItem
      setItems((data as ClothingItem[]) || []);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os itens',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const generateCode = () => {
    const prefix = 'ROU';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const addItem = async (item: Omit<ClothingItem, 'id' | 'created_at' | 'code'>) => {
    try {
      const itemWithCode = {
        ...item,
        code: generateCode()
      };

      const { data, error } = await supabase
        .from('clothing_items')
        .insert([itemWithCode])
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data as ClothingItem, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Item adicionado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item',
        variant: 'destructive',
      });
    }
  };

  const updateItem = async (id: string, updates: Partial<ClothingItem>) => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? data as ClothingItem : item));
      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o item',
        variant: 'destructive',
      });
    }
  };

  const markAsSold = async (id: string) => {
    await updateItem(id, { status: 'sold', sold_at: new Date().toISOString() });
  };

  const markAsAvailable = async (id: string) => {
    await updateItem(id, { status: 'available', sold_at: undefined });
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Item removido com sucesso',
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o item',
        variant: 'destructive',
      });
    }
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
    loading,
    addItem,
    updateItem,
    markAsSold,
    markAsAvailable,
    deleteItem,
    getStats,
    refetch: fetchItems,
  };
}
