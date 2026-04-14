# English Platform Architecture

Esta documentação descreve a arquitetura da Plataforma de Cursos, atualizada para o padrão MVC (Model-View-Controller) no backend, com separação clara de responsabilidades entre o ambiente Local e o Serverless (Vercel).

---

## 1. Visão Geral da Arquitetura

O sistema é dividido em duas partes principais:
1. **Frontend (Cliente)**: SPA em React processada pelo Vite, responsável pela visualização, gerenciamento de estado global de UI (temas, progresso) e interação do usuário.
2. **Backend (API)**: Uma API RESTful que consome um arquivo JSON atuando como banco de dados NoSQL.

### A Dualidade do Backend (Local vs. Produção)

Devido aos requisitos de hospedagem, o backend possui dois pontos de entrada, mas compartilha a mesma lógica de core (Model/Config):

- **Local Development (`server/index.js`)**: Um sub-aplicativo Express tradicional, stateful. Inicia na porta 5000, escuta as requisições, faz o bind de todos os Routers em uma única instância.
- **Production (`api/`)**: Funções Serverless provisionadas dinamicamente pela Vercel. Cada arquivo dentro de `api/` atua como um endpoint isolado e stateless.

Para não haver duplicação de regras de negócio ou de leitura do "banco de dados" (ModuleData.json), foi criada a camada `server/shared/`.

---

## 2. Padrão MVC no Backend

O código backend que existia num único arquivo monolítico agora está estruturado da seguinte forma:

```mermaid
graph TD
    Client[React Frontend] -->|HTTP Requests| Router
    
    subgraph Express (Local)
        Router[Routes Layer] --> Controllers
    end
    
    subgraph Vercel (Produção)
        Serverless[api/*.js] --> Controllers & Shared
    end

    Controllers[Controllers Layer] --> Model
    
    subgraph Shared Data Layer
        Model[DataStore Model]
        Auth[Auth Service]
        CORS[CORS Config]
    end
    
    Model -.->|Read/Write| DB[(ModuleData.json)]
```

### Camadas:

- **Routes (`server/routes/`)**: Recebe a requisição HTTP local, aciona middlewares de autenticação e passa a requisição para o Controller adequado. Não contém regra de negócio.
- **Controllers (`server/controllers/`)**: Contém a lógica de negócio (ex: buscar índice, calcular próximo ID, formatar os dados e retornar HTTP `200` ou `40x`).
- **Models / Shared (`server/shared/`)**:
  - `dataStore.js`: Cuida do acesso ao disco (`fs.readFileSync`), manipulação direta do JSON e contém helpers puros como `findLesson`, `generateId`. Consegue resolver caminhos alternativos essenciais para a Vercel (`/var/task/`).
  - `auth.js`: Lógica unificada de verificação das credenciais.
  - `cors.js`: Wrapper unificado de CORS para Serverless.

---

## 3. Organização do Frontend

No lado cliente, os componentes visuais foram extraídos para diretórios de escopo reduzido para facilitar a manutenção.

### Estrutura e Padrões:

- **`src/components/ui/`**: Componentes burros (dumb/presentational), não têm estado complexo ou acesso a rotas. São apenas blocos de montar (`Button`, `Card`, `Modal`). Recebem props para tudo e adaptam-se ao Tema.
- **`src/components/layout/`**: Componentes que compõe esqueletos de página. Têm maior complexidade interna e conhecem contextos maiores (ex: `Header` que sabe as rotas e muda o tema da aplicação globalmente; `AudioPlayer`).
- **`src/layouts/`**: Outlets principais do `react-router-dom` (MainLayout para área de aluno, AdminLayout para retaguarda).
- **`src/pages/`**: Os componentes de página (Views) conectados ao `useUserProgress` que agregam toda a UI.
- **`src/styles/`**: Toda a gestão de Design System. `theme.js` contém os design tokens (Cores, Gradientes, Sombras) permitindo que o `ThemeProvider` propague os valores via Props nas Styled Components.

### Persistência de Estado (Frontend)
- O progresso do usuário em cada etapa é inteiramente *client-side* persistido via `localStorage` (isolado pelo custom hook `useUserProgress.js`), para aliviar o backend de operações intensivas de "marcação de completude" e facilitar funcionamento offline/cache.
