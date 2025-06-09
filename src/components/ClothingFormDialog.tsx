
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClothingItem, CLOTHING_CATEGORIES, CLOTHING_SIZES } from '@/types/clothing';

interface ClothingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<ClothingItem, 'id' | 'created_at'>) => void;
  onDelete?: () => void;
  initialData?: ClothingItem;
  mode: 'create' | 'edit';
}

export function ClothingFormDialog({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  initialData,
  mode,
}: ClothingFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    size: '',
    color: '',
    price: '',
    description: '',
    status: 'available' as 'available' | 'sold',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        size: initialData.size,
        color: initialData.color,
        price: initialData.price.toString(),
        description: initialData.description || '',
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        size: '',
        color: '',
        price: '',
        description: '',
        status: 'available',
      });
    }
  }, [initialData, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.size || !formData.color || !formData.price) {
      return;
    }

    onSubmit({
      name: formData.name,
      category: formData.category,
      size: formData.size,
      color: formData.color,
      price: parseFloat(formData.price),
      description: formData.description,
      status: formData.status,
      sold_at: formData.status === 'sold' ? new Date().toISOString() : undefined,
    });

    if (mode === 'create') {
      setFormData({
        name: '',
        category: '',
        size: '',
        color: '',
        price: '',
        description: '',
        status: 'available',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastrar Nova Peça' : 'Editar Peça'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Peça *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Blusa Floral Rosa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {CLOTHING_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho *</Label>
              <Select 
                value={formData.size} 
                onValueChange={(value) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tam." />
                </SelectTrigger>
                <SelectContent>
                  {CLOTHING_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ex: Rosa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição opcional da peça..."
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {mode === 'edit' && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                >
                  Excluir
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Cadastrar' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
