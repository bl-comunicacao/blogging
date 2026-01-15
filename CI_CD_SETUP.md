# 🔧 Configuração CI/CD - Testes Unitários

## 📋 Problema Resolvido

Os testes unitários foram convertidos para testes reais que precisam de um banco de dados PostgreSQL. O workflow do GitHub Actions foi atualizado para:

1. ✅ Iniciar um container PostgreSQL antes dos testes
2. ✅ Aguardar o banco estar pronto
3. ✅ Configurar variáveis de ambiente corretas
4. ✅ Criar tabelas automaticamente via `init-db.js`
5. ✅ Limpar containers após os testes

## 🔄 Mudanças Realizadas

### 1. **Workflow do GitHub Actions** (`.github/workflows/main.yml`)

**Adicionado:**
- Container PostgreSQL para testes
- Aguarda banco estar pronto antes de rodar testes
- Variáveis de ambiente configuradas
- Limpeza automática de containers

### 2. **init-db.js** (`src/config/init-db.js`)

**Melhorado:**
- Agora cria as tabelas automaticamente se não existirem
- Lê o arquivo `tables.sql` e executa
- Funciona tanto localmente quanto no CI/CD

### 3. **Arquivo de Exemplo** (`env.test.example`)

**Criado:**
- Exemplo de configuração para testes
- Pode ser copiado para `.env.test` localmente

## 🚀 Como Funciona no CI/CD

1. **Checkout do código**
2. **Configura Node.js 18**
3. **Instala dependências** (`npm ci`)
4. **Inicia PostgreSQL em container Docker**
   - Aguarda até 30 segundos para o banco estar pronto
   - Verifica conectividade
5. **Roda testes unitários** (`npm test`)
   - Variáveis de ambiente configuradas
   - Banco de dados disponível
6. **Limpa containers** (sempre, mesmo se falhar)

## 📝 Variáveis de Ambiente no CI/CD

```yaml
DB_HOST: localhost
DB_PORT: 5432
DB_USER: postgres
DB_PASSWORD: postgres
DB_NAME: blog
NODE_ENV: test
```

## ✅ Testes Locais

Para rodar os testes localmente, você precisa:

1. **Ter PostgreSQL rodando:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Criar arquivo `.env.test`** (opcional, pode usar variáveis de ambiente):
   ```bash
   cp env.test.example .env.test
   ```

3. **Rodar testes:**
   ```bash
   npm test
   ```

## 🔍 Verificação

O workflow agora:
- ✅ Inicia PostgreSQL corretamente
- ✅ Aguarda banco estar pronto
- ✅ Configura variáveis de ambiente
- ✅ Cria tabelas automaticamente
- ✅ Roda testes com banco real
- ✅ Limpa recursos após execução

## 📊 Status

**Antes:**
- ❌ Testes falhavam no CI/CD (sem banco de dados)
- ❌ Tabelas não eram criadas automaticamente

**Depois:**
- ✅ Testes passam no CI/CD
- ✅ Banco de dados configurado automaticamente
- ✅ Tabelas criadas via `init-db.js`
- ✅ Limpeza automática de recursos
