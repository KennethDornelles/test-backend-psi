# 🏥 PSI API - Sistema de Agendamento

Sistema de agendamento de consultas psicológicas e médicas desenvolvido com NestJS e PostgreSQL.

## 🚀 Configuração do Ambiente

### 1. **Pré-requisitos**
- Node.js 18+ 
- Docker (para PostgreSQL)
- Bun ou npm/yarn

### 2. **Banco de Dados PostgreSQL**

```bash
# Executar container PostgreSQL
docker run --name psi-api-e \
  -e POSTGRES_PASSWORD=root123 \
  -e POSTGRES_DB=psi_api \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d \
  postgres:15
```

### 3. **Variáveis de Ambiente**

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

**Configurações obrigatórias:**
```env
# Database
DATABASE_URL="postgresql://postgres:root123@localhost:5432/psi_api?schema=public"

# JWT (GERE CHAVES SEGURAS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Session
SESSION_SECRET=your-session-secret-key-change-this-in-production
```

### 4. **Instalação e Execução**

```bash
# Instalar dependências
bun install
# ou
npm install

# Gerar cliente Prisma
bunx prisma generate
# ou
npx prisma generate

# Executar migrações
bunx prisma migrate dev --name init
# ou
npx prisma migrate dev --name init

# Iniciar aplicação
bun run start:dev
# ou
npm run start:dev
```

## 📋 Variáveis de Ambiente Completas

### **Database**
- `DATABASE_URL` - String de conexão PostgreSQL

### **Application**
- `NODE_ENV` - Ambiente (development/production/test)
- `PORT` - Porta da aplicação (padrão: 3000)
- `API_PREFIX` - Prefixo da API (padrão: api/v1)

### **JWT Authentication**
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRES_IN` - Tempo de expiração do token (padrão: 24h)
- `JWT_REFRESH_SECRET` - Chave para refresh token
- `JWT_REFRESH_EXPIRES_IN` - Tempo de expiração do refresh (padrão: 7d)

### **Email (Notificações)**
- `SMTP_HOST` - Servidor SMTP
- `SMTP_PORT` - Porta SMTP
- `SMTP_USER` - Usuário SMTP
- `SMTP_PASS` - Senha SMTP
- `SMTP_FROM` - Email remetente

### **Redis (Cache)**
- `REDIS_HOST` - Host Redis (padrão: localhost)
- `REDIS_PORT` - Porta Redis (padrão: 6379)
- `REDIS_PASSWORD` - Senha Redis (opcional)

### **Security**
- `BCRYPT_ROUNDS` - Rounds para hash de senha (padrão: 12)
- `SESSION_SECRET` - Chave secreta para sessões

### **Rate Limiting**
- `RATE_LIMIT_TTL` - Janela de tempo em segundos (padrão: 60)
- `RATE_LIMIT_LIMIT` - Máximo de requisições (padrão: 100)

### **Appointments**
- `DEFAULT_APPOINTMENT_DURATION` - Duração padrão em minutos (padrão: 60)
- `MIN_APPOINTMENT_DURATION` - Duração mínima (padrão: 30)
- `MAX_APPOINTMENT_DURATION` - Duração máxima (padrão: 180)

### **Notifications**
- `ENABLE_EMAIL_NOTIFICATIONS` - Habilitar notificações por email (padrão: true)
- `ENABLE_SMS_NOTIFICATIONS` - Habilitar notificações por SMS (padrão: false)
- `SMS_API_KEY` - Chave da API de SMS
- `SMS_API_SECRET` - Segredo da API de SMS

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
bun run start:dev

# Build
bun run build

# Testes
bun run test
bun run test:e2e

# Prisma
bunx prisma studio          # Interface visual do banco
bunx prisma migrate dev     # Nova migração
bunx prisma migrate reset   # Reset do banco
bunx prisma generate        # Gerar cliente

# Linting
bun run lint
bun run format
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/health`

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações
├── modules/         # Módulos da aplicação
│   ├── auth/        # Autenticação
│   ├── users/       # Usuários
│   ├── psychologists/ # Psicólogos
│   ├── doctors/     # Médicos
│   ├── patients/    # Pacientes
│   └── appointments/ # Agendamentos
├── shared/          # Utilitários compartilhados
└── main.ts          # Arquivo principal
```

## 🔐 Segurança

- ✅ Validação de entrada com class-validator
- ✅ Autenticação JWT
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Helmet para headers de segurança
- ✅ Hash de senhas com bcrypt
- ✅ Validação de variáveis de ambiente com Zod

## 📝 Próximos Passos

1. Configure as variáveis de ambiente
2. Execute as migrações do banco
3. Configure o SMTP para notificações
4. Implemente os módulos de negócio
5. Configure testes automatizados
