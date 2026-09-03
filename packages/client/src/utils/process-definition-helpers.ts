/**
 * Presentation-layer helpers for ProcessDefinition rows.
 *
 * Pure functions — no React, no hooks. Consumers (Next.js apps, other clients)
 * import these from `@igrp/framework-process-studio-client` to keep the
 * decoration/formatting consistent across UIs.
 */
import type { AuditUser, ProcessDefinition } from '@irn/framework-process-studio-types';

/**
 * Formats a deployment date to `dd/MM/yyyy HH:mm`.
 *
 * Accepts three shapes the Spring backend may return:
 *  - ISO string (`"2026-05-07T11:58:12.248"`) — `@JsonFormat`-annotated fields
 *  - Java `LocalDateTime` serialized as an array (`[year, month, day, hour, min, sec, nanos]`)
 *    — default Jackson behaviour when no `@JsonFormat` is set
 *  - Already-formatted string (`"07/05/2026 11:58"`) — passes through unchanged
 *
 * Empty / invalid input → empty string.
 */
export const formatDeploymentDate = (input?: string | number[] | null): string => {
  if (input == null || input === '') return '';
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Java LocalDateTime as [y, m, d, h?, min?, s?, ns?]
  if (Array.isArray(input)) {
    if (input.length < 3) return '';
    const [year, month, day, hour = 0, minute = 0] = input;
    if (year == null || month == null || day == null) return '';
    return `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`;
  }

  const str = String(input);
  // Already in `dd/MM/yyyy HH:mm[:ss]` — leave as-is
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(str)) return str;

  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * Returns ` por <fullName>` (with leading space) when an audit user is present,
 * otherwise an empty string. Use to suffix headers / titles without conditionals.
 */
export const formatAuthorSuffix = (user?: AuditUser | null): string => {
  if (user && user.fullName) return ` por ${user.fullName}`;
  return '';
};

/**
 * Row shape used by tables that display process definitions.
 *
 * Adds flattened audit display fields (`*Tbl`) and a formatted `deploymentDate`.
 * Fields that the decoration step always assigns are tightened to required
 * strings so consumers don't have to re-narrow before binding to UI state
 * (e.g. studio-generated `Table1` types with non-optional fields).
 */
export type ProcessDefinitionTableRow = Omit<ProcessDefinition, 'deploymentDate' | 'version'> & {
  deploymentDate: string;
  version: string;
  createdByNameTbl: string;
  createdDateTbl: string;
  lastModifiedByNameTbl: string;
  lastModifiedDateTbl: string;
  projectName?: string;
};

/**
 * Decorate a raw `ProcessDefinition` for table consumption:
 *   - coerce `version` to string (`N/D` fallback)
 *   - format `deploymentDate` to `dd/MM/yyyy HH:mm`
 *   - flatten `createdBy` / `lastModifiedBy` to display strings (`*Tbl`)
 */
export const decorateProcessDefinitionRow = (pd: ProcessDefinition): ProcessDefinitionTableRow => {
  return {
    ...pd,
    version: pd?.version != null ? String(pd.version) : 'N/D',
    deploymentDate: formatDeploymentDate(pd?.deploymentDate),
    createdByNameTbl: pd?.createdBy?.fullName ?? '',
    createdDateTbl: pd?.createdDate ?? '',
    lastModifiedByNameTbl: pd?.lastModifiedBy?.fullName ?? '',
    lastModifiedDateTbl: pd?.lastModifiedDate ?? '',
  };
};

/**
 * Client-side substring filter for process-definition rows (case-insensitive).
 * Only applies the substring keys present in `filters` (empty / undefined skipped).
 *
 * Use as a workaround when the backend free-text params do exact match.
 */
export interface ProcessDefinitionSubstringFilters {
  processKey?: string;
  processName?: string;
  projectName?: string;
}

export const filterProcessDefinitionsBySubstring = <
  T extends Pick<ProcessDefinitionTableRow, 'processKey' | 'title' | 'projectName'>,
>(
  rows: T[],
  filters: ProcessDefinitionSubstringFilters,
): T[] => {
  const pk = (filters.processKey ?? '').trim().toLowerCase();
  const pn = (filters.processName ?? '').trim().toLowerCase();
  const pr = (filters.projectName ?? '').trim().toLowerCase();
  if (!pk && !pn && !pr) return rows;
  return rows.filter((row) => {
    if (
      pk &&
      !String(row.processKey ?? '')
        .toLowerCase()
        .includes(pk)
    )
      return false;
    if (
      pn &&
      !String(row.title ?? '')
        .toLowerCase()
        .includes(pn)
    )
      return false;
    if (
      pr &&
      !String(row.projectName ?? '')
        .toLowerCase()
        .includes(pr)
    )
      return false;
    return true;
  });
};
