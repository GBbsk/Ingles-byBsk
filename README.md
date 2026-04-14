# English Learning Platform

Uma plataforma moderna para ensino de inglês, inspirada no layout da Netflix (com dark/light mode e interface altamente visual), focada na retenção e controle de progresso do aluno.

## Índice
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura e Fluxo de Dados](#arquitetura-e-fluxo-de-dados)
- [Instalação e Uso](#instalação-e-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Manutenção (Painel Admin)](#manutenção-painel-admin)

---

## Funcionalidades

### Área do Aluno
- **Design Netflix-like**: Navegação fluida por "Módulos em Destaque", cards interativos e interface limpa.
- **Modo Dark / Light**: Tema completamente customizado usando `styled-components` e variáveis unificadas.
- **Progresso Pessoal (`localStorage`)**:
  - Salva em cache as aulas assistidas.
  - "Continue de onde parou" direto na Home.
  - Progress bar dinâmico por card de módulo e aula.
- **Consumo de Aulas**: Suporte a vídeos (incorporados via iframe), listas de leitura (PDF/DOC) e player customizado.

### Área Administrativa (Restrita)
- Painel para Cadastro, Update e Delete (CRUD) de Módulos.
- Criação e gerenciamento das Aulas de cada módulo.
- Gerenciador de Arquivos anexos e links de Áudio exclusivos por aula.

---

## Tecnologias Utilizadas

**Frontend:**
- [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Styled Components](https://styled-components.com/) (Design System global, theming e micro-animações)
- [React Router DOM](https://reactrouter.com/) (Roteamento cliente)
- [React Icons](https://react-icons.github.io/react-icons/)

**Backend (Arquitetura Dual):**
- [Express](https://expressjs.com/) para Servidor de Desenvolvimento Local.
- **Vercel Serverless Functions** (`/api/*`) para o ambiente de Produção.
- Banco de Dados local NoSQL baseado num arquivo `ModuleData.json`.

---

## Arquitetura e Fluxo de Dados

A plataforma foi refatorada para adotar o padrão **MVC (Model-View-Controller)** no backend, compartilhado de forma inteligente entre o servidor local e as _serverless functions_.

*(Para uma visão técnica detalhada, veja o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md) anexado a este repositório).*

---

## Instalação e Uso

### Pré-requisitos
- Node.js (v18+) // Recomendado LTS

### 1. Clonar e Instalar
```bash
git clone <url-do-repositorio>
cd ingles-GBbsk
npm install
```

### 2. Rodar o Ambiente Local (Dev)
```bash
npm run dev
```
O comando acima iniciará simultaneamente:
- **Backend (Express)** na porta `5000` (escutando por `/api/*` e manipulando direto no JSON).
- **Frontend (Vite)** na porta `5173`. Navegue para `http://localhost:5173/`.

### 3. Build para Produção
```bash
npm run build
```

---

## Estrutura do Projeto

```text
├── api/                   # (PROD) Vercel Serverless Functions (Backend Stateless)
├── server/                # (DEV) Express App (Backend Stateful)
│   ├── controllers/       # Lógica MVC para módulos, aulas e recursos
│   ├── routes/            # Definição de endpoints REST
│   └── shared/            # Common Core: DataStore Model e Auth Compartilhado
├── src/
│   ├── components/        # Frontend UI
│   │   ├── layout/        # Cabeçalhos, footers, reprodutores
│   │   └── ui/            # Botões, cards, modais (Dumb components)
│   ├── data/              # Banco de dados local (ModuleData.json)
│   ├── hooks/             # Hooks customizados (useUserProgress)
│   ├── layouts/           # MainLayout (Aluno) e AdminLayout (Dashboard)
│   ├── pages/             # Views do aluno e do painel admin
│   └── styles/            # Theming (cores, global, animações)
└── package.json
```

---

## Manutenção (Painel Admin)

A área de administrador é desenhada para não precisar de mexer no código ou no JSON manualmente.

1. Navegue para `http://localhost:5173/login` (ou clique em "Login" no menu).
2. Use as credenciais administrativas fornecidas para você.
3. No **Dashboard**, você pode visualizar estatísticas gerais.
4. Em **Gerenciar Módulos**, você adiciona grandes blocos temáticos.
5. Em **Aulas**, vincule os vídeos (por ex.: links do YouTube/Vimeo) com seus módulos pais.
6. Em **Arquivos de Apoio**, suba PDFs ou Google Drive links para anexar a aulas específicas.
