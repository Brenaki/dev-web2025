# Frontend - TaskManager

Frontend moderno para o sistema de gerenciamento de tarefas, construído com React, TypeScript, Tailwind CSS e integração completa com o backend NestJS.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para aplicações SPA
- **React Query** - Gerenciamento de estado e cache de dados
- **Axios** - Cliente HTTP para APIs
- **Lucide React** - Ícones modernos e consistentes

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Registro de novos usuários
- Gerenciamento de sessão com JWT
- Rotas protegidas

### 📝 Gerenciamento de Tarefas
- Criar novas tarefas
- Visualizar lista de tarefas
- Marcar tarefas como concluídas
- Editar título das tarefas
- Excluir tarefas
- Interface responsiva e moderna

### 🎨 Interface
- Design system consistente com Tailwind CSS
- Componentes reutilizáveis (Button, Input, Card, etc.)
- Layout responsivo para desktop e mobile
- Tema claro com suporte a modo escuro (preparado)

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- Backend NestJS rodando na porta 3000

### Passos para instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   O frontend está configurado para se conectar ao backend em `http://localhost:3000`

3. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação:**
   Abra `http://localhost:5173` no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── layout/         # Componentes de layout
│   ├── tasks/          # Componentes de tarefas
│   └── ui/             # Componentes de UI reutilizáveis
├── contexts/           # Contextos React (Auth)
├── services/           # Serviços de API
├── types/              # Definições de tipos TypeScript
├── lib/                # Utilitários e helpers
└── App.tsx             # Componente principal
```

## 🔧 Componentes Principais

### AuthContext
- Gerencia estado de autenticação
- Controla login/logout
- Persiste sessão no localStorage

### TaskList
- Lista todas as tarefas do usuário
- Permite criar novas tarefas
- Gerencia estado das tarefas

### TaskItem
- Renderiza tarefa individual
- Permite editar, marcar como concluída e excluir
- Interface inline para edição

## 🌐 Integração com Backend

O frontend se integra com as seguintes APIs do backend:

- `POST /auth/login` - Autenticação
- `POST /auth/register` - Registro
- `GET /auth/profile` - Perfil do usuário
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa

## 🎯 Próximos Passos

- [ ] Implementar estatísticas em tempo real
- [ ] Adicionar filtros e busca de tarefas
- [ ] Implementar categorias para tarefas
- [ ] Adicionar notificações
- [ ] Implementar modo escuro
- [ ] Adicionar testes unitários
- [ ] Implementar PWA

## 🐛 Solução de Problemas

### CORS Errors
Certifique-se de que o backend está configurado com CORS habilitado para `http://localhost:5173`

### Problemas de Autenticação
Verifique se o token JWT está sendo enviado corretamente nos headers das requisições

### Erros de Build
Execute `npm run build` para verificar se há erros de TypeScript

## 📝 Licença

Este projeto faz parte do sistema TaskManager desenvolvido para fins educacionais.
