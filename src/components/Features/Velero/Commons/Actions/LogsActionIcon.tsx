'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconFileDescription } from '@tabler/icons-react';

import { ResourceLogs } from '@/components/Features/Velero/Commons/Forms/ResourceLogs';
import { useUIStatus } from '@/contexts/UIContext';

interface LogsActionIconProps {
  resourceType: string;
  record: any;
}

export default function LogsActionIcon({ resourceType, record }: LogsActionIconProps) {
  return (
    <Tooltip label="Logs">
      <ActionIcon
        disabled={
          record.status?.phase !== undefined && record.status.phase.toLowerCase() === 'inprogress'
        }
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            fullScreen: true,
            title: `${resourceType} logs ${record.metadata.name}`,
            children: (
              <ResourceLogs resourceType={resourceType} resourceName={record.metadata.name} />
            ),
          });
        }}
      >
        <IconFileDescription />
      </ActionIcon>
    </Tooltip>
  );
}
