import type {
  Project,
  PaginatedResponse,
  ProcessDefinition,
} from "@igrp/process-studio-frontend-types";

// Testing the new types
const createProcessDefinition: ProcessDefinition = {
  title: "Employee Onboarding Process",
  description: "Complete workflow for onboarding new employees",
  projectId: "proj-001",
  status: "ACTIVE",
  processDefinitionId: "proc-001",
  version: "1.0.0",
  statusDesc: "Process is active and ready for execution",
};

const createProcessDefinition2: ProcessDefinition = {
  title: "Leave Request Process",
  description: "Workflow for handling employee leave requests",
  projectId: "proj-001",
  status: "DRAFT",
  processDefinitionId: "proc-002",
  version: "2.1.0",
  statusDesc: "Process is in draft mode",
};

const createProject: Project = {
  code: "HR-PROJECTS",
  name: "Human Resources Processes",
  description: "Collection of HR-related business processes",
  projectId: "proj-001",
  processDefinitions: [createProcessDefinition, createProcessDefinition2],
};

const createPaginatedResponse: PaginatedResponse<ProcessDefinition> = {
  pageNumber: 1,
  pageSize: 10,
  totalElements: 25,
  totalPages: 3,
  last: false,
  first: true,
  content: [createProcessDefinition, createProcessDefinition2],
};

// Example function using the types
function initializeStudioApp() {
  console.log("Initializing IGRP Process Studio App...");

  // Testing new types
  console.log("\n=== Testing New Types ===");
  console.log("Process Definition:", createProcessDefinition);
  console.log("Project:", createProject);
  console.log("Paginated Response:", createPaginatedResponse);

  // Demonstrate pagination functionality
  console.log("\n=== Pagination Demo ===");
  console.log(
    `Page ${createPaginatedResponse.pageNumber} of ${createPaginatedResponse.totalPages}`
  );
  console.log(
    `Showing ${createPaginatedResponse.content.length} of ${createPaginatedResponse.totalElements} items`
  );
  console.log(`Is first page: ${createPaginatedResponse.first}`);
  console.log(`Is last page: ${createPaginatedResponse.last}`);

  // Demonstrate project structure
  console.log("\n=== Project Structure Demo ===");
  console.log(`Project: ${createProject.name} (${createProject.code})`);
  console.log(`Description: ${createProject.description}`);
  console.log(
    `Number of process definitions: ${createProject.processDefinitions.length}`
  );
  createProject.processDefinitions.forEach((proc, index) => {
    console.log(
      `  ${index + 1}. ${proc.title} - ${proc.status} (v${proc.version})`
    );
  });
}

// Export the function and example data
export {
  initializeStudioApp,
  createProcessDefinition,
  createProject,
  createPaginatedResponse,
};

// Initialize the app when this module is imported
initializeStudioApp();
