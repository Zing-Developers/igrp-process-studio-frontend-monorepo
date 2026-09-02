# IGRP Process Studio Types

Pacote de tipos compartilhados para o IGRP Process Studio.

## Instalação

```bash
npm install @igrp/framework-process-studio-types
```

## Uso

### Importar tipos básicos

```typescript
import type {
  Project,
  ProcessDefinition,
  PaginatedResponse,
} from '@igrp/framework-process-studio-types';

const project: Project = {
  code: 'PROJ001',
  name: 'Meu Projeto',
  description: 'Descrição do projeto',
  projectId: 'uuid-123',
  processDefinitions: [],
};
```

### Importar tipos do cliente

```typescript
import type {
  ProcessStudioClientConfig,
  ProcessStudioClient,
} from '@igrp/framework-process-studio-types';

const config: ProcessStudioClientConfig = {
  baseUrl: 'https://api.igrp-studio.com',
  apiKey: 'your-api-key',
};
```

## Tipos Disponíveis

### Tipos Básicos

```typescript
interface Project {
  code: string;
  name: string;
  description: string;
  projectId: string;
  processDefinitions: ProcessDefinition[];
}

interface ProcessDefinition {
  title: string;
  description: string;
  projectId: string;
  status: string;
  processDefinitionId: string;
  version: string;
  statusDesc: string;
}

interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  content: T[];
}
```

### Tipos do Cliente

```typescript
interface ProcessStudioClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ProcessStudioClient {
  projects: {
    getAll: () => Promise<PaginatedResponse<Project>>;
    getById: (id: string) => Promise<Project>;
    create: (project: Project) => Promise<Project>;
    update: (project: Project) => Promise<Project>;
    createOrUpdate: (project: Project) => Promise<Project>;
    delete: (code: string) => Promise<any>;
  };
  processDefinitions: {
    getAll: () => Promise<ProcessDefinition[]>;
    getById: (id: string) => Promise<ProcessDefinition>;
    getByProjectId: (projectId: string) => Promise<ProcessDefinition[]>;
    create: (projectId: string, processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    update: (projectId: string, processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    createOrUpdate: (processDefinition: ProcessDefinition) => Promise<ProcessDefinition>;
    saveDiagram: (
      processDefinitionId: string,
      processDefinition: ProcessDefinition,
    ) => Promise<Response>;
    deploy: (
      processDefinitionId: string,
      processDefinition: ProcessDefinition,
    ) => Promise<Response>;
  };
}
```
