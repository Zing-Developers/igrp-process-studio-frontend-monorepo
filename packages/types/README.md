# IGRP Process Studio Types

Pacote de tipos compartilhados para o IGRP Process Studio.

## Instalação

```bash
npm install @irn/framework-process-studio-types
```

## Uso

### Importar tipos básicos

```typescript
import type {
  Project,
  ProcessDefinition,
  PaginatedResponse,
} from '@irn/framework-process-studio-types';

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
} from '@irn/framework-process-studio-types';

const config: ProcessStudioClientConfig = {
  baseUrl: 'https://api.igrp-studio.com',
  apiKey: 'your-api-key',
};
```

## Tipos Disponíveis

### Tipos principais

```typescript
import type {
  AuditMetadata,
  ProjectRequestDTO,
  ProjectResponseDTO,
  ProjectSummaryDTO,
  ProcessDefinitionRequestDTO,
  ProcessDefinitionResponseDTO,
  ProcessDefinitionResponseLightDTO,
  EmailAccessMappingRequestDTO,
  EmailAccessMappingDTO,
  M2mKeyRequestDTO,
  M2mKeyCreatedDTO,
  M2mKeySummaryDTO,
  PaginatedResponse,
} from '@irn/framework-process-studio-types';
```

### Tipos do Cliente

```typescript
interface ProcessStudioClientConfig {
  baseUrl?: string;
  // Sent as Authorization: Bearer <apiKey>.
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ProcessStudioClient {
  projects: {
    getAll: (filter?: ProjectFilter) => Promise<WrapperListaProjectDTO>;
    getById: (projectId: string) => Promise<ProjectResponseDTO>;
    create: (project: ProjectRequestDTO) => Promise<ProjectResponseDTO>;
    update: (projectId: string, project: ProjectRequestDTO) => Promise<ProjectResponseDTO>;
    enable: (projectId: string) => Promise<string>;
    disable: (projectId: string) => Promise<string>;
  };
  processDefinitions: {
    list: (filter?: ProcessDefinitionFilter) => Promise<WrapperListaProcessDefinitionDTO>;
    getById: (processId: string) => Promise<ProcessDefinitionResponseDTO>;
    create: (
      projectId: string,
      definition: ProcessDefinitionRequestDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    update: (
      processId: string,
      definition: ProcessDefinitionRequestDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    saveDiagram: (
      processKey: string,
      diagram: BpmDiagramDTO,
    ) => Promise<ProcessDefinitionResponseDTO>;
    deploy: (processKey: string, diagram: BpmDiagramDTO) => Promise<ProcessDefinitionResponseDTO>;
  };
}
```
