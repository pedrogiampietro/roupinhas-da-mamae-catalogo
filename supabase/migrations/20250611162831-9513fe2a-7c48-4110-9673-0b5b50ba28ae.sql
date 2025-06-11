
-- Adicionar novas colunas para informações de venda
ALTER TABLE public.clothing_items 
ADD COLUMN buyer_name TEXT,
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending'));
