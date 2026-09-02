import { useState, useEffect } from 'react';
import type { Project, PaginatedResponse } from '@igrp/framework-process-studio-types';

interface UseProjectsReturn {
  projects: PaginatedResponse<Project> | null;
  loading: boolean;
  error: string | null;
  createProject: (project: Project) => Promise<Project | null>;
  updateProject: (project: Project) => Promise<Project | null>;
  deleteProject: (code: string) => Promise<boolean>;
  refreshProjects: () => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<PaginatedResponse<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Project): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the projects list
        await fetchProjects();
        return result.data;
      } else {
        setError(result.error || 'Failed to create project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    }
  };

  const updateProject = async (project: Project): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the projects list
        await fetchProjects();
        return result.data;
      } else {
        setError(result.error || 'Failed to update project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      return null;
    }
  };

  const deleteProject = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${code}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the projects list
        await fetchProjects();
        return true;
      } else {
        setError(result.error || 'Failed to delete project');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
