# Sistema de Autenticação

Este módulo implementa um sistema completo de autenticação JWT para a aplicação NestJS.

## Funcionalidades

- **Login**: Autenticação com email e senha
- **JWT Tokens**: Geração e validação de tokens JWT
- **Guards**: Proteção de rotas com autenticação
- **Middleware**: Validação automática de tokens
- **Decorators**: Acesso fácil ao usuário autenticado

## Endpoints

### POST /auth/login
Faz login do usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  }
}
```

### GET /auth/profile
Retorna o perfil do usuário autenticado (requer token JWT).

### POST /auth/logout
Faz logout do usuário (requer token JWT).

## Como usar

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### 2. Acessar rota protegida
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Proteger uma rota
```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('example')
@UseGuards(JwtAuthGuard) // Protege todas as rotas do controller
export class ExampleController {
  @Get()
  getData(@CurrentUser() user: any) {
    // user contém os dados do usuário autenticado
    return `Hello ${user.username}!`;
  }
}
```

### 4. Usar o decorator CurrentUser
```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Post()
create(@Body() dto: any, @CurrentUser() user: any) {
  console.log('User:', user);
  // user.userId, user.email, user.username
}
```

## Configuração

### Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Middleware global (opcional)
Para aplicar autenticação em todas as rotas automaticamente, adicione o middleware no `app.module.ts`:

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth/middleware/auth.middleware';

@Module({...})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
```

## Estrutura de arquivos

```
src/auth/
├── auth.module.ts          # Módulo principal
├── auth.service.ts         # Serviço de autenticação
├── auth.controller.ts      # Controller de autenticação
├── strategies/             # Estratégias do Passport
│   ├── jwt.strategy.ts     # Estratégia JWT
│   └── local.strategy.ts   # Estratégia local
├── guards/                 # Guards de autenticação
│   ├── jwt-auth.guard.ts   # Guard JWT
│   └── local-auth.guard.ts # Guard local
├── middleware/             # Middleware
│   └── auth.middleware.ts  # Middleware de autenticação
└── decorators/             # Decorators personalizados
    └── current-user.decorator.ts # Decorator para usuário atual
```

## Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT expiram em 24 horas
- Todas as rotas protegidas requerem token válido
- Middleware valida automaticamente tokens em todas as requisições

## Dependências

- `@nestjs/jwt`: Geração e validação de JWT
- `@nestjs/passport`: Estratégias de autenticação
- `passport-jwt`: Estratégia JWT
- `passport-local`: Estratégia local
- `bcrypt`: Hash de senhas
