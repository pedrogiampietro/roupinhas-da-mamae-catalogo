
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClothingItem } from '@/types/clothing';
import { Package, PackageCheck, Edit, MessageCircle, Trash2 } from 'lucide-react';
import { ClothingFormDialog } from './ClothingFormDialog';
import { SaleDialog } from './SaleDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClothingCardProps {
  item: ClothingItem;
  onMarkAsSold: (id: string, saleData?: {
    buyerName: string;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending';
  }) => void;
  onMarkAsAvailable: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ClothingItem>) => void;
  onDelete: (id: string) => void;
  showWhatsApp?: boolean;
}

export function ClothingCard({ 
  item, 
  onMarkAsSold, 
  onMarkAsAvailable, 
  onUpdate, 
  onDelete,
  showWhatsApp = false
}: ClothingCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `https://etysnilrceunntujuvby.supabase.co/storage/v1/object/public/clothing-images/${imageUrl}`;
  };

  const handleStatusToggle = () => {
    if (item.status === 'available') {
      setIsSaleDialogOpen(true);
    } else {
      onMarkAsAvailable(item.id);
    }
  };

  const handleConfirmSale = (saleData: {
    buyerName: string;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending';
  }) => {
    onMarkAsSold(item.id, saleData);
    setIsSaleDialogOpen(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '5541988785871';
    const message = `Olá, tenho interesse na roupa ${item.code}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="pb-3">
          {item.image_url && (
            <div className="aspect-square overflow-hidden rounded-lg mb-3">
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {item.code}
                </Badge>
              </div>
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
            {!showWhatsApp && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a peça "{item.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
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

          {/* Informações de venda */}
          {item.status === 'sold' && (item.buyer_name || item.payment_method) && (
            <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
              {item.buyer_name && (
                <div>
                  <span className="text-muted-foreground">Comprador:</span>
                  <span className="ml-1 font-medium">{item.buyer_name}</span>
                </div>
              )}
              {item.payment_method && (
                <div>
                  <span className="text-muted-foreground">Pagamento:</span>
                  <span className="ml-1 font-medium">{item.payment_method}</span>
                </div>
              )}
              {item.payment_status && (
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge 
                    variant={item.payment_status === 'paid' ? 'default' : 'secondary'}
                    className="ml-1 text-xs"
                  >
                    {item.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(item.price)}
            </span>
            
            {showWhatsApp ? (
              <Button
                onClick={handleWhatsAppClick}
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            ) : (
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
            )}
          </div>
          
          {item.sold_at && (
            <p className="text-xs text-muted-foreground">
              Vendido em {new Date(item.sold_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      {!showWhatsApp && (
        <>
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
          
          <SaleDialog
            open={isSaleDialogOpen}
            onOpenChange={setIsSaleDialogOpen}
            item={item}
            onConfirmSale={handleConfirmSale}
          />
        </>
      )}
    </>
  );
}
