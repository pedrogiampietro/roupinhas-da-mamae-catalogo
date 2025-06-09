
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  onImageRemoved?: () => void;
}

export function ImageUpload({ onImageUploaded, currentImageUrl, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getImageUrl = (path: string) => {
    return `https://etysnilrceunntujuvby.supabase.co/storage/v1/object/public/clothing-images/${path}`;
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const imageUrl = getImageUrl(data.path);
      setPreviewUrl(imageUrl);
      onImageUploaded(data.path);
      
      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a imagem',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione apenas arquivos de imagem',
          variant: 'destructive',
        });
        return;
      }

      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'A imagem deve ter no máximo 5MB',
          variant: 'destructive',
        });
        return;
      }

      uploadImage(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const getDisplayImageUrl = () => {
    if (!previewUrl) return null;
    
    if (previewUrl.startsWith('http')) {
      return previewUrl;
    }
    
    return getImageUrl(previewUrl);
  };

  return (
    <div className="space-y-2">
      <Label>Imagem da Peça</Label>
      
      {previewUrl ? (
        <div className="relative">
          <div className="aspect-square w-32 h-32 overflow-hidden rounded-lg border">
            <img
              src={getDisplayImageUrl()!}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="aspect-square w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <span className="text-xs text-muted-foreground">Enviando...</span>
            </div>
          ) : (
            <div className="text-center">
              <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Clique para adicionar</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {previewUrl ? 'Trocar Imagem' : 'Adicionar Imagem'}
      </Button>

      <p className="text-xs text-muted-foreground">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
      </p>
    </div>
  );
}
