'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateBslForm } from '@/components/Features/Velero/BackupLocations/Forms/CreateBslForm';

interface CreateBslToolbarIconProps {
  reload: number;
  setReload: any;
}

export default function CreateBslToolbarIcon({ reload, setReload }: CreateBslToolbarIconProps) {
  return (
    <Tooltip label="Create BSL">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            modalId: 'newBSL',
            title: 'Create New Backups Storage Location',
            size: 'xl',
            children: <CreateBslForm reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}
