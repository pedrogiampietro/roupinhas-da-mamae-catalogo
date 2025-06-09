
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClothingItem } from '@/types/clothing';
import { Package, PackageCheck, Edit } from 'lucide-react';
import { ClothingFormDialog } from './ClothingFormDialog';

interface ClothingCardProps {
  item: ClothingItem;
  onMarkAsSold: (id: string) => void;
  onMarkAsAvailable: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ClothingItem>) => void;
  onDelete: (id: string) => void;
}

export function ClothingCard({ 
  item, 
  onMarkAsSold, 
  onMarkAsAvailable, 
  onUpdate, 
  onDelete 
}: ClothingCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleStatusToggle = () => {
    if (item.status === 'available') {
      onMarkAsSold(item.id);
    } else {
      onMarkAsAvailable(item.id);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                <Badge 
                  variant={item.status === 'available' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {item.status === 'available' ? 'Disponível' : 'Vendido'}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Tamanho:</span>
              <span className="ml-1 font-medium">{item.size}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cor:</span>
              <span className="ml-1 font-medium">{item.color}</span>
            </div>
          </div>
          
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(item.price)}
            </span>
            
            <Button
              onClick={handleStatusToggle}
              variant={item.status === 'available' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              {item.status === 'available' ? (
                <>
                  <PackageCheck className="h-4 w-4" />
                  Marcar Vendido
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" />
                  Marcar Disponível
                </>
              )}
            </Button>
          </div>
          
          {item.soldAt && (
            <p className="text-xs text-muted-foreground">
              Vendido em {item.soldAt.toLocaleDateString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      <ClothingFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={(data) => {
          onUpdate(item.id, data);
          setIsEditOpen(false);
        }}
        onDelete={() => {
          onDelete(item.id);
          setIsEditOpen(false);
        }}
        initialData={item}
        mode="edit"
      />
    </>
  );
}
