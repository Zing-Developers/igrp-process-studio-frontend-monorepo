# Process Studio Demo App

Esta é uma aplicação de demonstração para testar o cliente do Process Studio.

## Configuração

1. **Instale as dependências:**
```bash
pnpm install
```

2. **Configure a variável de ambiente:**
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_GATEWAY=http://localhost:8083
```

## Executando a Aplicação

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start
```

## Executando os Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com cobertura
pnpm test:coverage
```

## Estrutura dos Testes

### Testes do Cliente (`src/tests/client.test.ts`)
- Testa todas as funções do cliente
- Verifica se as chamadas para o API Gateway estão funcionando
- Testa criação, leitura, atualização e exclusão de projetos e processos

### Testes dos Hooks (`src/tests/hooks.test.tsx`)
- Testa a integração com React Query
- Verifica se os hooks estão funcionando corretamente
- Testa o comportamento assíncrono

### Componente de Demonstração (`src/components/ProcessStudioDemo.tsx`)
- Interface visual para testar o cliente
- Lista projetos e definições de processo
- Permite criar novos projetos e processos
- Disponível em `/demo`

## Endpoints Testados

### Projects
- `GET /api/v1/projects` - Listar projetos
- `GET /api/v1/projects/{code}` - Obter projeto por código
- `POST /api/v1/projects` - Criar projeto
- `PUT /api/v1/projects` - Atualizar projeto
- `DELETE /api/v1/projects/{code}` - Deletar projeto

### Process Definitions
- `GET /api/v1/projects/process/{processDefinitionId}` - Obter definição por ID
- `POST /api/v1/projects/process?projectId={projectId}` - Criar definição
- `PUT /api/v1/projects/process/{projectId}` - Atualizar definição
- `PUT /api/v1/projects/process/{processDefinitionId}/diagram` - Salvar diagrama
- `POST /api/v1/projects/process/{processDefinitionId}/deploy` - Deploy da definição

## Como Usar

1. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

2. **Acesse a página de demonstração:**
```
http://localhost:3000/demo
```

3. **Execute os testes:**
```bash
pnpm test
```

## Verificações

Os testes verificam:

- ✅ **Imports corretos** do pacote core
- ✅ **Tipos TypeScript** funcionando
- ✅ **Chamadas HTTP** para o API Gateway
- ✅ **Integração com React Query**
- ✅ **Componentes React** funcionando
- ✅ **Tratamento de erros**
- ✅ **Estados de loading**

## Swagger

Para verificar a documentação da API:
```
http://localhost:8083/swagger-ui/index.html
``` 