-- Política para permitir acesso público de leitura apenas para itens disponíveis
CREATE POLICY "Public can view available clothing items" 
  ON public.clothing_items 
  FOR SELECT 
  TO anon 
  USING (status = 'available'); 