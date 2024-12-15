'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconRestore } from '@tabler/icons-react';

import { RestoreBackup } from '../ActionsForm/RestoreBackup';

interface RestoreActionIconProps {
  resourceType: string;
  record: any;
  reload: number;
  setReload: any;
}

export default function RestoreActionIcon({
  resourceType,
  record,
  reload,
  setReload,
}: RestoreActionIconProps) {
  return (
    <Tooltip label="Restore">
      <ActionIcon
        size="sm"
        variant="transparent"
        disabled={record.status.phase !== 'Completed'}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Restore Backup ${record.metadata.name}`,
            size: 'xl',
            children: (
              <RestoreBackup
                resourceType={resourceType}
                resourceName={record.metadata.name}
                reload={reload}
                setReload={setReload}
              />
            ),
          });
        }}
      >
        <IconRestore size={16} color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
