
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClothingItem } from '@/types/clothing';
import { ClothingFilters } from '@/components/ClothingFilters';
import { ClothingCard } from '@/components/ClothingCard';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag } from 'lucide-react';

const Catalog = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data as ClothingItem[]) || []);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar itens
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Catálogo de Roupas
              </h1>
              <p className="text-muted-foreground mt-1">
                Descubra nossa coleção de roupas disponíveis
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin'}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Área do Vendedor
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6">
          <ClothingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter=""
            onStatusChange={() => {}}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Grid de Peças */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onMarkAsSold={() => {}}
                onMarkAsAvailable={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                showWhatsApp={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Nenhuma peça encontrada
            </h3>
            <p className="text-muted-foreground">
              {items.length === 0 
                ? 'Não há peças disponíveis no momento.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
