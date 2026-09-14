# OpenAPI Sync Assessment — `packages/client`

**Contract:** `packages/client/api-docs.json` — OpenAPI 3.1.0, 27 operations,
tags: `Project`, `ProcessDefinition`, `Parameterization`, `EmailAccessMapping`,
`m-2m-key-controller`.
**Refreshed:** 2026-09-12 · **Branch:** `zing-release`

> Implementation update: the missing and incomplete models documented below have been
> synchronized. Transport authentication, path encoding, HAL+JSON/empty-response handling,
> Node-compatible ESM exports, package naming, and endpoint-level tests are also in place.

## Verdict

**SYNCHRONIZED.**

- **Transport + operations layer** (`packages/client/src`) — **fully synchronized.** Every
  contract operation has a client method with the correct path, verb, path params, query
  params and request body. No stale or invented endpoints.
- **Model/type layer** it depends on (`@irn/framework-process-studio-types`,
  `packages/types/src`) — **fully synchronized.** All 20 schemas are represented, including
  the new email-access DTOs and canonical `M2mKey*DTO` names.

Both packages build cleanly, all 27 operations have mocked request tests, and both package
entry points import successfully through Node ESM.

---

## Step 1 — Endpoint coverage matrix (27/27 mapped)

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
| 24 | GET `/email-access-mappings` | list_1 | `listEmailAccessMappings()` | ✅ |
| 25 | POST `/email-access-mappings` | create_1 | `createEmailAccessMapping(body)` | ✅ |
| 26 | PUT `/email-access-mappings/{id}` | update | `updateEmailAccessMapping(id, body)` | ✅ |
| 27 | DELETE `/email-access-mappings/{id}` | revoke | `revokeEmailAccessMapping(id)` | ✅ |

- **Missing:** none.
- **Stale (client → contract):** none. `createOrUpdateVariable` on `ProcessStudioApiClient`
  is a `@deprecated` shim delegating to `addVariablesToProcess` — acceptable.
- **Composite helpers** (not 1:1 ops, intentional): `projects.createOrUpdate`,
  `processDefinitions.createOrUpdate`, `processDefinitions.getAll` (fans out over
  `getProjects`).

**Response typing** — all correct: `string`-schema PATCH/enable/disable/delete/restore →
`Promise<string>`; bodyless M2M/email revocations → `Promise<void>`; JSON and HAL+JSON
array/object bodies parse because `parseResponse` matches any JSON content type.

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
`ProcessVariableRequestDTO`, `M2mKeyRequestDTO`, `M2mKeyCreatedDTO`, `EnumItemString`,
`WrapperListaProjectDTO` / `WrapperListaProcessDefinitionDTO`
(`PaginatedResponse<T>`, correct item types — full list uses `...LightDTO`).

### 2d. Live-contract additions and renames (2026-09-12)

| Contract schema | Type action |
|---|---|
| `EmailAccessMappingRequestDTO` | Added with email, permissions, description, notes, and expiry fields. |
| `EmailAccessMappingDTO` | Added with lifecycle and created/updated/revoked audit fields. |
| `M2mKeyRequestDTO` | Added as the canonical name; `CreateRequest` remains a deprecated alias. |
| `M2mKeyCreatedDTO` | Added as the canonical name; `CreatedResponse` remains a deprecated alias. |
| `M2mKeySummaryDTO` | Added as the canonical name; `KeySummary` remains a deprecated alias. |

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
2. **Resolved: `buildQueryString` drops `undefined`, `null`, and `""`**, preventing empty
   filters such as `?processKey=`.
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
6. Added all four email-access-mapping operations to the direct and composed clients, with
   verb, body, URL encoding, 204, and composed-surface tests.
7. Added `api-docs.json` to the client Prettier ignore list so contract refreshes stay
   byte-for-byte idempotent after builds.

## Intentional deviations and compatibility

- `GET /email-access-mappings` is typed as `EmailAccessMappingDTO[]`. Its description and
  top-level `type: array` establish a collection even though the generated schema places
  `$ref` directly beside `type` instead of under `items`.
- The contract provides no `required` arrays except for `BpmDiagramDTO.content`; all other
  model properties remain optional rather than inventing requiredness.
- No public type or method was removed. Legacy M2M names remain exported as deprecated
  aliases, and existing composite helpers remain available.
- The tracked legacy snapshot `api-docs-studio-frontend.json` remains unchanged; the
  synchronizer's authoritative refresh target is now `api-docs.json`.

## Verification (2026-09-12)

| Check | Result |
|---|---|
| `pnpm build:types` | ✅ Passed |
| `pnpm build:client` | ✅ Passed against freshly built types |
| `pnpm --filter @igrp/studio-demo exec tsc --noEmit -p tsconfig.json` | ✅ Passed |
| Client endpoint suite | ✅ 34/34 tests passed |
| Studio consumer Jest suite | ✅ 2/2 tests passed |
| Contract refetch after client build | ✅ Already current (idempotent) |
| Root `pnpm test` | ⚠️ Pre-existing placeholder exits 1 with `Error: no test specified` |

The skill's nominal `@igrp/platform-process-management-client-ui` consumer filter matches no
workspace package in this repository; `@igrp/studio-demo` is the actual consumer and was
checked instead.
