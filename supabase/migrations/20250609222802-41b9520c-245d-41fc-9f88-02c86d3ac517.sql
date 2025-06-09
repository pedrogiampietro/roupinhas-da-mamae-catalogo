
-- Criar bucket para imagens das roupas
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-images', 'clothing-images', true);

-- Criar política para permitir upload de imagens (todos podem fazer upload)
CREATE POLICY "Anyone can upload clothing images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clothing-images');

-- Criar política para permitir visualização de imagens (público)
CREATE POLICY "Anyone can view clothing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'clothing-images');

-- Criar política para permitir atualização de imagens (todos podem atualizar)
CREATE POLICY "Anyone can update clothing images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clothing-images');

-- Criar política para permitir exclusão de imagens (todos podem deletar)
CREATE POLICY "Anyone can delete clothing images"
ON storage.objects FOR DELETE
USING (bucket_id = 'clothing-images');
