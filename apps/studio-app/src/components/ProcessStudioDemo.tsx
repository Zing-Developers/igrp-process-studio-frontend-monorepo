'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createProcessStudioClient } from '@igrp/framework-process-studio-core';
import type { Project, ProcessDefinition } from '@igrp/framework-process-studio-types';

const client = createProcessStudioClient({
  baseUrl: 'http://localhost:8083',
});

export const ProcessStudioDemo: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');

  // Query para projetos
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.projects.getAll(),
  });

  // Query para definições de processo
  const { data: processDefinitions, isLoading: processDefinitionsLoading } = useQuery({
    queryKey: ['processDefinitions'],
    queryFn: () => client.processDefinitions.getAll(),
  });

  // Query para detalhes de um processo específico
  const { data: processDetails, isLoading: processDetailsLoading } = useQuery({
    queryKey: ['processDefinition', selectedProcess],
    queryFn: () => client.processDefinitions.getById(selectedProcess),
    enabled: !!selectedProcess,
  });

  if (projectsLoading) {
    return <div className="p-4">Carregando projetos...</div>;
  }

  if (projectsError) {
    return <div className="p-4 text-red-500">Erro ao carregar projetos: {projectsError.message}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Process Studio Demo</h1>
      
      {/* Seção de Projetos */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.content?.map((project) => (
            <div
              key={project.projectId}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project.projectId)}
            >
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-gray-600 text-sm">{project.code}</p>
              <p className="text-gray-500 text-sm mt-2">{project.description}</p>
              <div className="mt-2 text-xs text-blue-600">
                {project.processDefinitions?.length || 0} processos
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Definições de Processo */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Definições de Processo</h2>
        {processDefinitionsLoading ? (
          <div>Carregando definições de processo...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processDefinitions?.map((process) => (
              <div
                key={process.processDefinitionId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProcess(process.processDefinitionId)}
              >
                <h3 className="font-semibold">{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {process.status}
                  </span>
                  <span className="text-xs text-gray-500">v{process.version}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detalhes do Processo Selecionado */}
      {selectedProcess && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Detalhes do Processo</h2>
          {processDetailsLoading ? (
            <div>Carregando detalhes...</div>
          ) : (
            processDetails && (
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">{processDetails.title}</h3>
                <p className="text-gray-600 mb-4">{processDetails.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">ID:</span> {processDetails.processDefinitionId}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {processDetails.status}
                  </div>
                  <div>
                    <span className="font-semibold">Versão:</span> {processDetails.version}
                  </div>
                  <div>
                    <span className="font-semibold">Projeto:</span> {processDetails.projectId}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            // Teste de criação de projeto
            client.projects.create({
              name: 'Novo Projeto Teste',
              code: 'TEST' + Date.now(),
              description: 'Projeto criado via teste',
              projectId: '',
              processDefinitions: [],
            });
          }}
        >
          Criar Projeto Teste
        </button>
        
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={() => {
            // Teste de criação de processo
            if (selectedProject) {
              client.processDefinitions.create(selectedProject, {
                title: 'Novo Processo Teste',
                description: 'Processo criado via teste',
                projectId: selectedProject,
                status: 'DRAFT',
                processDefinitionId: '',
                version: '1.0',
                statusDesc: 'Rascunho',
              });
            }
          }}
          disabled={!selectedProject}
        >
          Criar Processo Teste
        </button>
      </div>
    </div>
  );
}; 