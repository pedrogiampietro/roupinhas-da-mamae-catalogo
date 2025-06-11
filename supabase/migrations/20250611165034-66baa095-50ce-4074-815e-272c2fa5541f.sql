
-- Remover as políticas duplicadas se existirem
DROP POLICY IF EXISTS "Public can view available clothing items" ON public.clothing_items;

-- Adicionar a coluna code que estava faltando
ALTER TABLE public.clothing_items 
ADD COLUMN IF NOT EXISTS code TEXT NOT NULL DEFAULT '';

-- Criar um trigger para gerar códigos únicos automaticamente se não fornecido
CREATE OR REPLACE FUNCTION generate_clothing_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code = '' OR NEW.code IS NULL THEN
    NEW.code := 'ROB' || LPAD(nextval('clothing_items_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar sequência para códigos se não existir
CREATE SEQUENCE IF NOT EXISTS clothing_items_code_seq START 1;

-- Criar trigger para gerar códigos automaticamente
DROP TRIGGER IF EXISTS generate_code_trigger ON public.clothing_items;
CREATE TRIGGER generate_code_trigger
  BEFORE INSERT ON public.clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION generate_clothing_code();

-- Recriar a política RLS correta para acesso público
CREATE POLICY "Public can view available clothing items" 
  ON public.clothing_items 
  FOR SELECT 
  TO anon 
  USING (status = 'available');

-- Atualizar registros existentes que não têm código
UPDATE public.clothing_items 
SET code = 'ROB' || LPAD(nextval('clothing_items_code_seq')::text, 4, '0')
WHERE code = '' OR code IS NULL;
