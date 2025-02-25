'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconRestore } from '@tabler/icons-react';

import { RestoreBackup } from '../Forms/RestoreBackup';
import { useUIStatus } from '@/contexts/UIContext';

interface RestoreActionIconProps {
  record: any;
  reload: number;
  setReload: any;
}

export default function RestoreActionIcon({ record, reload, setReload }: RestoreActionIconProps) {
  return (
    <Tooltip label="Restore">
      <ActionIcon
        size="sm"
        variant="subtle"
        disabled={record.status?.phase !== 'Completed'}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Restore Backup ${record.metadata.name}`,
            size: 'xl',
            children: (
              <RestoreBackup
                backupName={record.metadata.name}
                reload={reload}
                setReload={setReload}
              />
            ),
          });
        }}
      >
        <IconRestore color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
