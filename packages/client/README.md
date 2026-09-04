# IGRP Process Studio Core Client

Cliente reutilizável para integração com o IGRP Process Studio.

## Instalação

```bash
npm install @irn/framework-process-studio-client @irn/framework-process-studio-types
```

## Arquitetura

Este pacote oferece uma abordagem **cliente puro** que chama diretamente o API Gateway:

### **Cliente Direto ao API Gateway**

- Chama diretamente o API Gateway usando `NEXT_PUBLIC_API_GATEWAY`
- Sem dependências do Next.js
- Pode ser usado em qualquer projeto
- Configuração via variáveis de ambiente

## Configuração

### Configuração

```typescript
import { createProcessStudioClient } from '@irn/framework-process-studio-client';

const client = createProcessStudioClient({
  baseUrl: 'https://api.igrp-studio.com',
  apiKey: 'your-api-key',
  timeout: 30000,
  headers: {
    // headers customizados
  },
});
```

**Importante:** Configure a variável de ambiente `NEXT_PUBLIC_API_GATEWAY` no seu projeto:

```env
NEXT_PUBLIC_API_GATEWAY=https://api.igrp-studio.com
```

## Implementar hooks no seu projeto

O cliente não inclui hooks prontos, mas você pode implementá-los facilmente no seu projeto:

```typescript
// hooks/useProcessStudio.ts
import { useQuery, useMemo } from '@tanstack/react-query';
import { createProcessStudioClient } from '@irn/framework-process-studio-client';

const client = createProcessStudioClient({
  baseUrl: 'https://api.igrp-studio.com',
});

// Hook para listar definições de processo
export const useProcessDefinitions = () => {
  const queryResult = useQuery({
    queryKey: ['process'],
    queryFn: () => client.projects.getAll(),
  });

  const processDefinitions = useMemo(() => {
    if (!queryResult.data) return null;

    const allProcessDefinitions = queryResult.data?.content.flatMap((project) =>
      project.processDefinitions.map((processDefinition) => ({
        ...processDefinition,
        version: processDefinition.version || 'N/D',
      })),
    );

    return {
      data: allProcessDefinitions,
      totalProcessDefinitions: allProcessDefinitions?.length || 0,
      totalProjects: queryResult.data?.content.length || 0,
    };
  }, [queryResult.data]);

  return {
    ...queryResult,
    ...processDefinitions,
  };
};

// Hook para obter detalhes de uma definição
export const useProcessDefinition = (processDefinitionId: string) => {
  return useQuery({
    queryKey: ['processDefinition', processDefinitionId],
    queryFn: () => client.processDefinitions.getById(processDefinitionId),
    enabled: !!processDefinitionId,
  });
};

// Hook para listar projetos
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => client.projects.getAll(),
  });
};

// Hook para configuração de projetos (para selects)
export const useProjectConfiguration = () => {
  const projects = useProjects();

  const processOptions = useMemo(() => {
    if (!projects.data?.content) return [];

    return projects.data.content.map((project) => ({
      label: project.name,
      value: project.projectId,
    }));
  }, [projects.data]);

  return {
    isLoading: projects.isLoading,
    isError: projects.isError,
    processOptions,
  };
};
```

### Usar os hooks no seu componente

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProcessDefinitions, useProjects } from './hooks/useProcessStudio';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}

function YourApp() {
  const { data: processDefinitions, isLoading } = useProcessDefinitions();
  const { data: projects } = useProjects();

  return (
    <div>
      {isLoading ? 'Carregando...' : processDefinitions?.data?.map(item => (
        <div key={item.processDefinitionId}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Usar diretamente (sem React Query)

```typescript
import { createProcessStudioClient } from '@irn/framework-process-studio-client';

const client = createProcessStudioClient({
  baseUrl: 'https://api.igrp-studio.com',
});

// Listar projetos
const projects = await client.projects.getAll();

// Criar projeto
const newProject = await client.projects.create({
  name: 'Novo Projeto',
  code: 'NP001',
  description: 'Descrição do projeto',
});

// Listar definições de processo
const processDefinitions = await client.processDefinitions.getAll();

// Criar definição de processo
const newProcessDefinition = await client.processDefinitions.create('project-id', {
  title: 'Novo Processo',
  description: 'Descrição do processo',
  projectId: 'project-id',
  status: 'DRAFT',
});
```

## API Reference

### Client Configuration

```typescript
interface ProcessStudioClientConfig {
  baseUrl?: string;
  // Sent as Authorization: Bearer <apiKey>.
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}
```

### Projects API

```typescript
client.projects.getAll(); // Listar todos os projetos
client.projects.getById(id); // Obter projeto por ID
client.projects.create(project); // Criar projeto
client.projects.update(projectId, project); // Atualizar projeto
client.projects.createOrUpdate(project); // Criar ou atualizar
client.projects.enable(projectId); // Ativar projeto
client.projects.disable(projectId); // Desativar projeto
client.projects.getHistory(projectId, filter); // Histórico de processos
client.projects.getDeployed(projectId, filter); // Processos implantados
```

### Process Definitions API

```typescript
client.processDefinitions.getAll(); // Listar todas as definições
client.processDefinitions.list(filter); // Lista paginada e filtrada
client.processDefinitions.getById(id); // Obter definição por ID
client.processDefinitions.create(projectId, definition); // Criar definição
client.processDefinitions.update(processId, definition); // Atualizar definição
client.processDefinitions.createOrUpdate(definition); // Criar ou atualizar
client.processDefinitions.delete(processId); // Exclusão lógica
client.processDefinitions.restore(processId); // Restaurar definição
client.processDefinitions.saveDiagram(processKey, { content }); // Salvar diagrama
client.processDefinitions.deploy(processKey, { content }); // Deploy da definição
client.processDefinitions.addVariables(processId, variables); // Salvar variáveis
client.processDefinitions.getVariables(processId); // Obter variáveis
```

### Hooks (implementar no seu projeto)

```typescript
// Exemplo de implementação no seu projeto
useProcessDefinitions(); // Hook para listar definições
useProcessDefinition(id); // Hook para detalhes
useProjects(); // Hook para listar projetos
useProjectConfiguration(); // Hook para configuração
```

## Tipos

```typescript
import type {
  ProjectRequestDTO,
  ProjectResponseDTO,
  ProcessDefinitionRequestDTO,
  ProcessDefinitionResponseDTO,
  PaginatedResponse,
} from '@irn/framework-process-studio-types';
```

## Estrutura do Pacote

```
packages/client/
├── src/
│   ├── services/         # Cliente público
│   ├── utils/            # Transporte HTTP
│   ├── functions/        # Funções de negócio
│   └── index.ts         # Exportações principais
```

## Base Paths do API Gateway

### Projects

- `GET /api/v1/projects` - Listar projetos
- `GET /api/v1/projects/{projectId}` - Obter projeto por ID
- `POST /api/v1/projects` - Criar projeto
- `PUT /api/v1/projects/{projectId}` - Atualizar projeto
- `PATCH /api/v1/projects/{projectId}/enable` - Ativar projeto
- `PATCH /api/v1/projects/{projectId}/disable` - Desativar projeto

### Process Definitions

- `GET /api/v1/projects/process-definitions/{processId}` - Obter definição por ID
- `POST /api/v1/projects/{projectId}/process-definitions` - Criar definição
- `PUT /api/v1/projects/process-definitions/{processId}` - Atualizar definição
- `PUT /api/v1/projects/process-definitions/{processKey}/diagram` - Salvar diagrama
- `POST /api/v1/projects/process-definitions/{processKey}/deploy` - Deploy da definição
