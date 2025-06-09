# Catálogo de Roupinhas da Mamãe

Um catálogo digital moderno para visualização e gerenciamento de produtos de vestuário infantil.

## Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Ferramenta de build rápida para desenvolvimento frontend
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Router** - Roteamento para aplicações React
- **React Hook Form** - Biblioteca para formulários performáticos
- **Zod** - Validação de esquemas TypeScript

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd roupinhas-da-mamae-catalogo

# Instale as dependências
npm install
```

### Execução
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Linting
npm run lint
```

O aplicativo estará disponível em `http://localhost:8080`

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── lib/           # Utilitários e configurações
├── hooks/         # Custom hooks
└── types/         # Definições de tipos TypeScript
```

## Funcionalidades

- Catálogo de produtos com visualização em grid/lista
- Filtros por categoria, tamanho e preço
- Sistema de busca
- Visualização detalhada de produtos
- Interface responsiva e acessível

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
