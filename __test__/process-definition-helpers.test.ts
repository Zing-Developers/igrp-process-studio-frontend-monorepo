import { describe, expect, it } from 'vitest';

import {
  decorateProcessDefinitionRow,
  filterProcessDefinitionsBySubstring,
  formatAuthorSuffix,
  formatDeploymentDate,
} from '../packages/client/src/utils/process-definition-helpers';

describe('process definition helpers', () => {
  it('formats Java LocalDateTime arrays without timezone conversion', () => {
    expect(formatDeploymentDate([2026, 5, 7, 9, 4])).toBe('07/05/2026 09:04');
  });

  it('keeps an already formatted deployment date unchanged', () => {
    expect(formatDeploymentDate('07/05/2026 11:58')).toBe('07/05/2026 11:58');
  });

  it('handles missing author details', () => {
    expect(formatAuthorSuffix({ fullName: 'Ada Lovelace' })).toBe(' por Ada Lovelace');
    expect(formatAuthorSuffix()).toBe('');
  });

  it('decorates API rows for table display', () => {
    expect(
      decorateProcessDefinitionRow({
        processDefinitionId: 'process-id',
        version: 3,
        deploymentDate: '07/05/2026 11:58',
        userProfileCreatedBy: { fullName: 'Creator' },
        userProfileLastModifiedBy: { fullName: 'Editor' },
      }),
    ).toMatchObject({
      processDefinitionId: 'process-id',
      version: '3',
      deploymentDate: '07/05/2026 11:58',
      createdByNameTbl: 'Creator',
      lastModifiedByNameTbl: 'Editor',
    });
  });

  it('filters rows by trimmed, case-insensitive substrings', () => {
    const rows = [
      { processKey: 'invoice-approval', title: 'Invoice Approval', projectName: 'Finance' },
      { processKey: 'leave-request', title: 'Leave Request', projectName: 'People' },
    ];

    expect(
      filterProcessDefinitionsBySubstring(rows, {
        processKey: 'VOICE',
        projectName: ' fin ',
      }),
    ).toEqual([rows[0]]);
  });
});
