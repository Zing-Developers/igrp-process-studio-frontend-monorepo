'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@igrp/framework-process-studio-types';

export function ProjectsList() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    code: '',
    description: '',
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name || !newProject.code) {
      alert('Name and code are required');
      return;
    }

    const created = await createProject(newProject as Project);
    if (created) {
      setNewProject({ name: '', code: '', description: '' });
    }
  };

  const handleDeleteProject = async (code: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(code);
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      
      {/* Create Project Form */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              value={newProject.code}
              onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Project
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Projects</h2>
        {projects?.content && projects.content.length > 0 ? (
          <div className="grid gap-4">
            {projects.content.map((project) => (
              <div key={project.projectId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600">Code: {project.code}</p>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      ID: {project.projectId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.code)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}
