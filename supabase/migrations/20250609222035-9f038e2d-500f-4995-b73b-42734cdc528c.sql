-- Criar tabela para itens de roupa
CREATE TABLE public.clothing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sold_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso apenas a usuários autenticados (gerenciamento completo)
CREATE POLICY "Authenticated users can manage clothing items" 
  ON public.clothing_items 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Política para permitir acesso público de leitura apenas para itens disponíveis
CREATE POLICY "Public can view available clothing items" 
  ON public.clothing_items 
  FOR SELECT 
  TO anon 
  USING (status = 'available');

-- Inserir usuário admin padrão (senha será 'admin123')
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sistema.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
