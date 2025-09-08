import { ProjectsList } from '@/components/ProjectsList';

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Process Studio Client Example
          </h1>
          <p className="text-gray-600">
            This example demonstrates how to use the refactored Process Studio Client with server-side configuration.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <ProjectsList />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How it works:</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium">1. Server-Side Client Configuration</h3>
              <p className="mt-1">
                The server-side client is configured in <code className="bg-gray-100 px-1 rounded">src/lib/server-client.ts</code> 
                with environment-specific settings for development, staging, and production.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">2. API Routes</h3>
              <p className="mt-1">
                API routes in <code className="bg-gray-100 px-1 rounded">src/app/api/</code> use the server-side client 
                to communicate with the Process Studio API, handling authentication and environment-specific configurations.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">3. React Hooks</h3>
              <p className="mt-1">
                React hooks in <code className="bg-gray-100 px-1 rounded">src/hooks/</code> provide a clean interface 
                for components to interact with the API routes, handling loading states and errors.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">4. Environment Configuration</h3>
              <p className="mt-1">
                Different environments (development, staging, production) are automatically detected and configured 
                based on <code className="bg-gray-100 px-1 rounded">NODE_ENV</code> and environment variables.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Environment Setup</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Development:</strong> Uses localhost:8085 with debug enabled</p>
            <p><strong>Staging:</strong> Uses staging-api.igrp.cv with authentication</p>
            <p><strong>Production:</strong> Uses api.igrp.cv with authentication</p>
            <p><strong>Test:</strong> Uses localhost:8085 with shorter timeouts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
