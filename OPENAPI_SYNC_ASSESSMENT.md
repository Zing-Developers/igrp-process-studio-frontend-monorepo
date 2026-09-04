# OpenAPI Sync Assessment — `packages/client`

**Contract:** `packages/client/api-docs-studio-frontend.json` — OpenAPI 3.1.0, 23 operations,
tags: `Project`, `ProcessDefinition`, `Parameterization`, `m-2m-key-controller`.
**Date:** 2026-09-03 · **Implemented:** 2026-09-04 · **Branch:** `zing-release`

> Implementation update: the missing and incomplete models documented below have been
> synchronized. Transport authentication, path encoding, HAL+JSON/empty-response handling,
> Node-compatible ESM exports, package naming, and endpoint-level tests are also in place.

## Verdict

**SYNCHRONIZED.**

- **Transport + operations layer** (`packages/client/src`) — **fully synchronized.** Every
  contract operation has a client method with the correct path, verb, path params, query
  params and request body. No stale or invented endpoints.
- **Model/type layer** it depends on (`@irn/framework-process-studio-types`,
  `packages/types/src`) — **fully synchronized.** All 18 schemas are represented, including
  audit metadata and the nested `ProjectSummaryDTO` reference.

Both packages build cleanly, all 23 operations have mocked request tests, and both package
entry points import successfully through Node ESM.

---

## Step 1 — Endpoint coverage matrix (23/23 mapped)

| # | Method + path | operationId | Client method | OK |
|---|---|---|---|---|
| 1 | GET `/api/v1/projects` | getProjects | `getProjects(filter?)` | ✅ |
| 2 | POST `/api/v1/projects` | createProject | `createProject(body)` | ✅ |
| 3 | GET `/api/v1/projects/{projectId}` | getProjectById | `getProjectById(id)` | ✅ |
| 4 | PUT `/api/v1/projects/{projectId}` | updateProject | `updateProject(id, body)` | ✅ |
| 5 | PATCH `/api/v1/projects/{projectId}/enable` | enableProject | `enableProject(id)` | ✅ |
| 6 | PATCH `/api/v1/projects/{projectId}/disable` | disableProject | `disableProject(id)` | ✅ |
| 7 | GET `/api/v1/projects/{projectId}/history-process` | getProcessHistoryByProjectId | `getProcessHistoryByProjectId(id, filter?)` | ✅ |
| 8 | GET `/api/v1/projects/{projectId}/deployed-process` | getDeployedProcessByProjectId | `getDeployedProcessByProjectId(id, filter?)` | ✅ |
| 9 | GET `/api/v1/projects/process-definitions` | getProcessDefinition | `getProcessDefinitions(filter?)` | ✅ |
| 10 | GET `/api/v1/projects/process-definitions/{processId}` | getProcessDefinitionById | `getProcessDefinitionById(id)` | ✅ |
| 11 | PUT `/api/v1/projects/process-definitions/{processId}` | updateProcessDefinition | `updateProcessDefinition(id, body)` | ✅ |
| 12 | POST `/api/v1/projects/{projectId}/process-definitions` | saveProcessDefinition | `createProcessDefinition(projectId, body)` | ✅ |
| 13 | PUT `/api/v1/projects/process-definitions/{processKey}/diagram` | diagramEditorProcessDefinition | `saveDiagramProcessDefinition(processKey, body)` | ✅ |
| 14 | POST `/api/v1/projects/process-definitions/{processKey}/deploy` | deployProcessDefinition | `deployProcessDefinition(processKey, body)` | ✅ |
| 15 | GET `/api/v1/projects/process-definitions/{processId}/variables` | getProcessDefinitionVariables | `getVariables(id)` | ✅ |
| 16 | POST `/api/v1/projects/process-definitions/{processId}/variables` | addVariablesToProcess | `addVariablesToProcess(id, body[])` | ✅ |
| 17 | PATCH `/api/v1/projects/process-definitions/{processId}/restore` | restoreProcessDefinition | `restoreProcessDefinition(id)` | ✅ |
| 18 | PATCH `/api/v1/projects/process-definitions/{processId}/delete` | deleteProcessDefinition | `deleteProcessDefinition(id)` | ✅ |
| 19 | GET `/parameterization/process-definition-state` | getProcessDefinitionState | `getProcessDefinitionState()` | ✅ |
| 20 | GET `/m2m-keys` | list | `listM2mKeys()` | ✅ |
| 21 | POST `/m2m-keys` | create | `createM2mKey(body)` | ✅ |
| 22 | POST `/m2m-keys/{id}/rotate` | rotate | `rotateM2mKey(id)` | ✅ |
| 23 | DELETE `/m2m-keys/{id}` | revoke | `revokeM2mKey(id)` | ✅ |

- **Missing:** none.
- **Stale (client → contract):** none. `createOrUpdateVariable` on `ProcessStudioApiClient`
  is a `@deprecated` shim delegating to `addVariablesToProcess` — acceptable.
- **Composite helpers** (not 1:1 ops, intentional): `projects.createOrUpdate`,
  `processDefinitions.createOrUpdate`, `processDefinitions.getAll` (fans out over
  `getProjects`).

**Response typing** — all correct: `string`-schema PATCH/enable/disable/delete/restore →
`Promise<string>`; `revoke` (204, no content) → `Promise<void>`; `hal+json` array/object
bodies parse because `parseResponse` matches any `*/*json` content-type.

---

## Step 2 — Original schema diff (resolved)

### 2a. Previously missing schema

| Contract schema | Used by | Status |
|---|---|---|
| `ProjectSummaryDTO` (`projectId`, `code`, `name`, `appCode`, `active`) | `ProcessDefinitionResponseDTO.project`, `ProcessDefinitionResponseLightDTO.project` | **Resolved** |

### 2b. Previously missing response properties

| Type (`packages/types/src/index.ts`) | Properties present in contract but missing on the type |
|---|---|
| `ProcessDefinitionResponseLightDTO` | `project` (→ `ProjectSummaryDTO`), `createdAt`, `updatedAt` |
| `ProjectResponseDTO` | `createdAt`, `updatedAt` |
| `ArtifactVariableResponseDTO` | `createdBy`, `lastModifiedBy`, `createdAt`, `updatedAt`, `userProfileCreatedBy`, `userProfileLastModifiedBy` |
| `ProcessArtifactResponseDTO` | `createdBy`, `lastModifiedBy`, `createdAt`, `updatedAt`, `userProfileCreatedBy`, `userProfileLastModifiedBy` |
| `ProcessVariableResponseDTO` | `createdBy`, `lastModifiedBy`, `createdAt`, `updatedAt`, `userProfileCreatedBy`, `userProfileLastModifiedBy` |
| `KeySummary` | `updatedAt`, `updatedBy`, `userProfileUpdatedBy` |

Root cause: audit metadata is modelled inconsistently. `ProcessDefinitionResponseLightDTO`
and `ProjectResponseDTO` carry `createdBy`/`lastModifiedBy`/`userProfile*By` but drop the
two timestamps; the three nested `*ResponseDTO` schemas drop all six audit fields.
The contract puts the same six-field audit block (`createdBy`, `lastModifiedBy`,
`createdAt`, `updatedAt`, `userProfileCreatedBy`, `userProfileLastModifiedBy`) on every
persisted DTO — a shared `AuditMetadata` interface composed into each would fix this and
prevent recurrence.

### 2c. Schemas that ARE in sync

`UserProfileDTO`, `ProjectRequestDTO`, `BpmDiagramDTO` (incl. `required: [content]`),
`ProcessDefinitionRequestDTO` (incl. 8-value `status` enum → `ProcessDefinitionStatus`),
`ProcessVariableRequestDTO`, `CreateRequest`, `CreatedResponse`, `EnumItemString`,
`WrapperListaProjectDTO` / `WrapperListaProcessDefinitionDTO`
(`PaginatedResponse<T>`, correct item types — full list uses `...LightDTO`).

---

## Step 3 — Parameter diff (in sync)

| Filter type | Contract params | Match |
|---|---|---|
| `ProjectFilter` | `appCode?`, `pageNumber?`, `pageSize?` | ✅ |
| `ProjectProcessFilter` | `processName?`, `processKey?`, `pageSize?`, `pageNumber?` | ✅ |
| `ProcessDefinitionFilter` | `appCode?`, `processKey?`, `processName?`, `projectCode?`, `projectName?`, `state?`, `pageNumber?`, `pageSize?` | ✅ |

All query params are typed `string` (contract models paging as `string` with string
defaults `"0"`/`"20"`) and all optional, matching `required: false`.

---

## Minor / non-blocking observations (pre-existing, not caused by contract drift)

1. **Resolved: path params are URL-encoded** with `encodeURIComponent`.
2. **`buildQueryString` drops `undefined`/`null` but not `""`** — an empty-string filter
   value is still sent (`?processKey=`). Guideline suggests dropping `""` too.
3. **Resolved: `Accept` supports JSON and HAL+JSON**, and empty response bodies are handled.
4. **`servers[0].url` carries base path `/process-studio`** — the client does not hardcode
   it; the consumer must include it in `config.baseUrl`. No double-concatenation risk.
5. **Contract `tags` list omits `m-2m-key-controller`** though operations reference it —
   a contract-side inconsistency, no client impact.

---

## Completed actions

1. Added `ProjectSummaryDTO` to `packages/types/src/index.ts`.
2. Added `project?: ProjectSummaryDTO` to `ProcessDefinitionResponseLightDTO`.
3. Introduced a shared `AuditMetadata` interface (six optional audit fields) and composed it
   into `ProjectResponseDTO`, `ProcessDefinitionResponseLightDTO`,
   `ArtifactVariableResponseDTO`, `ProcessArtifactResponseDTO`, `ProcessVariableResponseDTO`.
4. Added `updatedAt?`, `updatedBy?`, `userProfileUpdatedBy?` to `KeySummary`.
5. Rebuilt `packages/types` → `packages/client` and type-checked `apps/studio-app` against
   `workspace:*` dependencies. Version bumping remains a release step.
