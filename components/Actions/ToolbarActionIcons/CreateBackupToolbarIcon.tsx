'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateBackup } from '../ActionsForm/CreateBackup';

interface CreateBackupToolbarIconProps {
  reload: number;
  setReload: any;
}

export default function CreateBackupToolbarIcon({
  reload,
  setReload,
}: CreateBackupToolbarIconProps) {
  return (
    <Tooltip label="Create backup">
      <ActionIcon
        size={30}
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Backup',
            size: 'lg',
            children: <CreateBackup reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Tooltip>
  );
}
