
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClothingItem } from '@/types/clothing';
import { Badge } from '@/components/ui/badge';

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ClothingItem | null;
  onConfirmSale: (saleData: {
    buyerName: string;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending';
  }) => void;
}

export function SaleDialog({ open, onOpenChange, item, onConfirmSale }: SaleDialogProps) {
  const [formData, setFormData] = useState({
    buyerName: '',
    paymentMethod: '',
    paymentStatus: 'pending' as 'paid' | 'pending',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.paymentMethod) {
      return;
    }

    onConfirmSale(formData);
    
    // Reset form
    setFormData({
      buyerName: '',
      paymentMethod: '',
      paymentStatus: 'pending',
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setFormData({
      buyerName: '',
      paymentMethod: '',
      paymentStatus: 'pending',
    });
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Venda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Item */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                {item.code}
              </Badge>
              <h3 className="font-semibold">{item.name}</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {item.category} • {item.size} • {item.color}
              </span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Nome do Comprador *</Label>
              <Input
                id="buyerName"
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                placeholder="Digite o nome do comprador"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Status do Pagamento *</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value: 'paid' | 'pending') => setFormData({ ...formData, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar Venda
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
