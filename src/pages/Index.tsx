import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClothingCard } from '@/components/ClothingCard';
import { ClothingFormDialog } from '@/components/ClothingFormDialog';
import { ClothingFilters } from '@/components/ClothingFilters';
import { StatsCard } from '@/components/StatsCard';
import { useClothingStore } from '@/hooks/useClothingStore';
import { Package, PackageCheck, Tag } from 'lucide-react';

const Index = () => {
  const {
    items,
    addItem,
    updateItem,
    markAsSold,
    markAsAvailable,
    deleteItem,
    getStats,
  } = useClothingStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const stats = getStats();

  // Filtrar itens
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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
                Gerencie seu estoque de forma simples e eficiente
              </p>
            </div>
            <Button 
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="w-full sm:w-auto"
            >
              Cadastrar Nova Peça
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Peças"
            value={stats.total}
            icon={<Package className="h-5 w-5" />}
          />
          <StatsCard
            title="Disponíveis"
            value={stats.available}
            subtitle="Peças em estoque"
            icon={<Tag className="h-5 w-5" />}
          />
          <StatsCard
            title="Vendidas"
            value={stats.sold}
            subtitle="Peças vendidas"
            icon={<PackageCheck className="h-5 w-5" />}
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(stats.totalValue)}
            subtitle="Estoque disponível"
          />
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <ClothingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
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
                onMarkAsSold={markAsSold}
                onMarkAsAvailable={markAsAvailable}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Nenhuma peça encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {items.length === 0 
                ? 'Comece cadastrando sua primeira peça no catálogo.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {items.length === 0 && (
              <Button onClick={() => setIsFormOpen(true)}>
                Cadastrar Primeira Peça
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog de Formulário */}
      <ClothingFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={(data) => {
          addItem(data);
          setIsFormOpen(false);
        }}
        mode="create"
      />
    </div>
  );
};

export default Index;
