# TaskManager - Sistema de Gerenciamento de Tarefas

## 📚 O que é este projeto?

Este é um projeto **educacional** desenvolvido para ensinar conceitos fundamentais de desenvolvimento web moderno. É um sistema completo de gerenciamento de tarefas (como um "To-Do List" avançado) que demonstra como construir aplicações web do zero.

### 🎯 Objetivo Educacional

Este projeto foi criado para acadêmicos e estudantes que querem aprender:
- Como funciona uma aplicação web completa
- Como o frontend e backend se comunicam
- Como implementar autenticação de usuários
- Como criar interfaces de usuário modernas
- Como trabalhar com bancos de dados

## 🌐 O que é uma Aplicação Web?

Uma aplicação web é como um programa de computador que roda na internet. Ela tem duas partes principais:

1. **Frontend** (o que você vê no navegador)
   - Interface do usuário (botões, formulários, listas)
   - Responsável pela experiência visual
   - Roda no seu navegador (Chrome, Firefox, etc.)

2. **Backend** (o que roda no servidor)
   - Lógica de negócio (regras do sistema)
   - Banco de dados (onde as informações são salvas)
   - Roda em um computador servidor

## 🏗️ Tecnologias Utilizadas (Explicação Simples)

### Backend (Servidor)
- **NestJS**: Um framework para criar APIs (como um "esqueleto" para o servidor)
- **Prisma**: Ferramenta para trabalhar com banco de dados de forma mais fácil
- **JWT**: Sistema de "chaves" para identificar usuários logados
- **SQLite**: Banco de dados simples (como uma planilha eletrônica)

### Frontend (Navegador)
- **React**: Biblioteca para criar interfaces interativas
- **TypeScript**: JavaScript com verificação de tipos (mais seguro)
- **Tailwind CSS**: Framework para estilizar rapidamente
- **Vite**: Ferramenta para desenvolver mais rápido

## 🚀 Como Executar o Projeto

### Pré-requisitos Básicos
- **Node.js**: É como o "motor" que faz tudo funcionar
  - Baixe em: https://nodejs.org/
  - Escolha a versão LTS (mais estável)
- **Editor de código**: Recomendamos o Visual Studio Code
  - Baixe em: https://code.visualstudio.com/

### Passo a Passo

#### 1. Preparar o Backend (Servidor)

```bash
# Abra o terminal e navegue para a pasta do projeto
cd dev-web2025/backend

# Instalar as "ferramentas" necessárias
npm install

# Preparar o banco de dados
npm run prisma:generate

# Criar as tabelas no banco
npm run prisma:migrate

# Ligar o servidor
npm run start:dev
```

**O que acontece?** O servidor "liga" e fica esperando por pedidos na porta 3000.

#### 2. Preparar o Frontend (Interface)

```bash
# Abra outro terminal e navegue para a pasta do frontend
cd dev-web2025/frontend

# Instalar as "ferramentas" necessárias
npm install

# Ligar a interface
npm run dev
```

**O que acontece?** A interface abre no seu navegador em `http://localhost:5173`

## 🔐 O que o Sistema Faz?

### Funcionalidades Principais

1. **Cadastro e Login**
   - Usuários podem criar uma conta
   - Fazer login com email e senha
   - Sistema de "chaves" (JWT) para manter o usuário logado

2. **Gerenciar Tarefas**
   - Criar novas tarefas
   - Marcar tarefas como concluídas
   - Editar tarefas existentes
   - Excluir tarefas

3. **Interface Amigável**
   - Design responsivo (funciona no celular e computador)
   - Componentes reutilizáveis
   - Tema preparado para modo escuro

## 📁 Estrutura do Projeto (Para Entender)

```
dev-web2025/
├── backend/                 # "Cérebro" da aplicação
│   ├── src/
│   │   ├── auth/           # Sistema de login/logout
│   │   ├── users/          # Gerenciar usuários
│   │   ├── tasks/          # Gerenciar tarefas
│   │   └── prisma/         # Configuração do banco
│   └── package.json        # Lista de dependências
├── frontend/                # "Rosto" da aplicação
│   ├── src/
│   │   ├── components/     # Peças da interface
│   │   ├── contexts/       # Gerenciar estado global
│   │   ├── services/       # Comunicação com o servidor
│   │   └── types/          # Definições de tipos
│   └── package.json        # Lista de dependências
└── README.md               # Este arquivo
```

## 🌐 Como as Partes Se Comunicam?

### Fluxo de uma Ação (Exemplo: Criar Tarefa)

1. **Usuário** clica em "Nova Tarefa" no frontend
2. **Frontend** envia pedido para o backend: "Criar tarefa X"
3. **Backend** recebe o pedido e:
   - Verifica se o usuário está logado
   - Salva a tarefa no banco de dados
   - Retorna confirmação
4. **Frontend** recebe a confirmação e atualiza a tela

## 🎓 Conceitos Importantes para Aprender

### 1. API (Application Programming Interface)
- É como um "menu" que o frontend usa para pedir coisas ao backend
- Cada "prato" do menu é uma funcionalidade diferente

### 2. Banco de Dados
- Como uma "biblioteca" onde as informações ficam guardadas
- Organizado em "prateleiras" (tabelas) e "livros" (registros)

### 3. Autenticação
- Sistema para identificar quem está usando o sistema
- Como uma "carteira de identidade" digital

### 4. Estado da Aplicação
- Como a aplicação "lembra" das coisas
- Exemplo: lista de tarefas, usuário logado, etc.

## 🐛 Problemas Comuns e Soluções

### "Não consigo acessar o sistema"
- Verifique se o backend está rodando (terminal deve mostrar "Application is running")
- Verifique se o frontend está rodando (deve abrir no navegador)

### "Erro de CORS"
- Significa que o frontend e backend não estão se comunicando
- Verifique se ambos estão rodando nas portas corretas

### "Erro de banco de dados"
- Execute `npm run prisma:generate` no backend
- Execute `npm run prisma:migrate` no backend

## 🎯 Próximos Passos para Aprender

### Nível Básico
- [ ] Entender como o HTML, CSS e JavaScript funcionam
- [ ] Aprender sobre requisições HTTP (GET, POST, PUT, DELETE)
- [ ] Compreender o que é um banco de dados

### Nível Intermediário
- [ ] Estudar sobre APIs REST
- [ ] Aprender sobre autenticação e segurança
- [ ] Entender sobre gerenciamento de estado

### Nível Avançado
- [ ] Implementar novas funcionalidades
- [ ] Adicionar testes automatizados
- [ ] Deploy da aplicação na internet

## 📚 Recursos para Aprender Mais

- **MDN Web Docs**: Documentação oficial da web
- **React Tutorial**: Tutorial oficial do React
- **NestJS Documentation**: Documentação do NestJS
- **Prisma Documentation**: Guia do Prisma

## 🤝 Contribuindo

Este é um projeto educacional! Sinta-se à vontade para:
- Fazer perguntas
- Sugerir melhorias
- Reportar problemas
- Contribuir com código

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais. Use-o para aprender e compartilhar conhecimento!

---

**💡 Dica**: Não se preocupe se não entender tudo de uma vez. Desenvolvimento web é um processo de aprendizado contínuo. Comece executando o projeto e depois explore o código aos poucos!