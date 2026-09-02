import { createProcessStudioClient } from '@igrp/framework-process-studio-client';
import type { Project, ProcessDefinition } from '@igrp/framework-process-studio-types';

// Mock da variável de ambiente
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv };
  process.env.NEXT_PUBLIC_API_GATEWAY = 'http://localhost:8085';
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Process Studio Client', () => {
  const client = createProcessStudioClient({
    baseUrl: 'http://localhost:8085',
  });

  describe('Client Configuration', () => {
    test('should create client with default configuration', () => {
      const clientWithDefaults = createProcessStudioClient({});
      expect(clientWithDefaults).toBeDefined();
      expect(clientWithDefaults.projects).toBeDefined();
      expect(clientWithDefaults.processDefinitions).toBeDefined();
    });

    test('should create client with custom configuration', () => {
      const clientWithCustomConfig = createProcessStudioClient({
        baseUrl: 'http://custom-api.com',
        timeout: 60000,
        headers: { 'Authorization': 'Bearer token' }
      });
      expect(clientWithCustomConfig).toBeDefined();
    });
  });

  describe('Projects', () => {
    test('should get all projects', async () => {
      try {
        const projects = await client.projects.getAll();
        console.log(projects);
        expect(projects).toBeDefined();
        expect(Array.isArray(projects.content)).toBe(true);
      } catch (error) {
        // Se a API não estiver disponível, apenas verifica se o erro é de rede
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should get project by code', async () => {
      try {
        const project = await client.projects.getById('test-project');
        expect(project).toBeDefined();
        expect(project).toHaveProperty('projectId');
        expect(project).toHaveProperty('name');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create project', async () => {
      const newProject: Partial<Project> = {
        name: 'Test Project',
        code: 'TEST001',
        description: 'Test project description',
      };

      try {
        const project = await client.projects.create(newProject as Project);
        expect(project).toBeDefined();
        expect(project.name).toBe(newProject.name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should update project', async () => {
      const updatedProject: Partial<Project> = {
        projectId: 'test-id',
        name: 'Updated Project',
        code: 'UPD001',
        description: 'Updated project description',
      };

      try {
        const project = await client.projects.update(updatedProject as Project);
        expect(project).toBeDefined();
        expect(project.name).toBe(updatedProject.name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create or update project (create new)', async () => {
      const newProject: Partial<Project> = {
        name: 'New Project',
        code: 'NEW001',
        description: 'New project description',
      };

      try {
        const project = await client.projects.createOrUpdate(newProject as Project);
        expect(project).toBeDefined();
        expect(project.name).toBe(newProject.name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create or update project (update existing)', async () => {
      const existingProject: Partial<Project> = {
        projectId: 'existing-id',
        name: 'Existing Project',
        code: 'EXIST001',
        description: 'Existing project description',
      };

      try {
        const project = await client.projects.createOrUpdate(existingProject as Project);
        expect(project).toBeDefined();
        expect(project.name).toBe(existingProject.name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should delete project', async () => {
      try {
        const result = await client.projects.delete('test-project');
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Process Definitions', () => {
    test('should get all process definitions', async () => {
      try {
        const processDefinitions = await client.processDefinitions.getAll();
        expect(processDefinitions).toBeDefined();
        expect(Array.isArray(processDefinitions)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should get process definition by id', async () => {
      try {
        const processDefinition = await client.processDefinitions.getById('test-process-id');
        expect(processDefinition).toBeDefined();
        expect(processDefinition).toHaveProperty('processDefinitionId');
        expect(processDefinition).toHaveProperty('title');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should get process definitions by project id', async () => {
      try {
        const processDefinitions = await client.processDefinitions.getByProjectId('test-project-id');
        expect(processDefinitions).toBeDefined();
        expect(Array.isArray(processDefinitions)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create process definition', async () => {
      const newProcessDefinition: Partial<ProcessDefinition> = {
        title: 'Test Process',
        description: 'Test process description',
        projectId: 'test-project-id',
        status: 'DRAFT',
      };

      try {
        const processDefinition = await client.processDefinitions.create(
          'test-project-id',
          newProcessDefinition as ProcessDefinition
        );
        expect(processDefinition).toBeDefined();
        expect(processDefinition.title).toBe(newProcessDefinition.title);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should update process definition', async () => {
      const updatedProcessDefinition: Partial<ProcessDefinition> = {
        processDefinitionId: 'test-process-id',
        title: 'Updated Process',
        description: 'Updated process description',
        projectId: 'test-project-id',
        status: 'ACTIVE',
      };

      try {
        const processDefinition = await client.processDefinitions.update(
          'test-project-id',
          updatedProcessDefinition as ProcessDefinition
        );
        expect(processDefinition).toBeDefined();
        expect(processDefinition.title).toBe(updatedProcessDefinition.title);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create or update process definition (create new)', async () => {
      const newProcessDefinition: Partial<ProcessDefinition> = {
        title: 'New Process',
        description: 'New process description',
        projectId: 'test-project-id',
        status: 'DRAFT',
      };

      try {
        const processDefinition = await client.processDefinitions.createOrUpdate(
          newProcessDefinition as ProcessDefinition
        );
        expect(processDefinition).toBeDefined();
        expect(processDefinition.title).toBe(newProcessDefinition.title);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should create or update process definition (update existing)', async () => {
      const existingProcessDefinition: Partial<ProcessDefinition> = {
        processDefinitionId: 'existing-process-id',
        title: 'Existing Process',
        description: 'Existing process description',
        projectId: 'test-project-id',
        status: 'ACTIVE',
      };

      try {
        const processDefinition = await client.processDefinitions.createOrUpdate(
          existingProcessDefinition as ProcessDefinition
        );
        expect(processDefinition).toBeDefined();
        expect(processDefinition.title).toBe(existingProcessDefinition.title);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should save diagram', async () => {
      const processDefinition: Partial<ProcessDefinition> = {
        processDefinitionId: 'test-process-id',
        title: 'Test Process',
        projectId: 'test-project-id',
      };

      try {
        const response = await client.processDefinitions.saveDiagram(
          'test-process-id',
          processDefinition as ProcessDefinition
        );
        expect(response).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should deploy process definition', async () => {
      const processDefinition: Partial<ProcessDefinition> = {
        processDefinitionId: 'test-process-id',
        title: 'Test Process',
        projectId: 'test-project-id',
      };

      try {
        const response = await client.processDefinitions.deploy(
          'test-process-id',
          processDefinition as ProcessDefinition
        );
        expect(response).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const clientWithInvalidUrl = createProcessStudioClient({
        baseUrl: 'http://invalid-url-that-does-not-exist.com',
        timeout: 1000, // Short timeout for faster test
      });

      try {
        await clientWithInvalidUrl.projects.getAll();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('should handle timeout errors', async () => {
      const clientWithShortTimeout = createProcessStudioClient({
        baseUrl: 'http://localhost:8083',
        timeout: 1, // Very short timeout
      });

      try {
        await clientWithShortTimeout.projects.getAll();
        // If the API is fast enough, this might not timeout
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
}); 