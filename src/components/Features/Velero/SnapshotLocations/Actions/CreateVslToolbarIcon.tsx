'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateVsl } from '@/components/Features/Velero/SnapshotLocations/Forms/CreateVsl';

interface CreateVslToolbarIconProps {
  reload: number;
  setReload: any;
}

export default function CreateVslToolbarIcon({ reload, setReload }: CreateVslToolbarIconProps) {
  return (
    <Tooltip label="Create VSL">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            modalId: 'newVSL',
            title: 'Create New Volume Snapshot Location',
            size: 'xl',
            children: <CreateVsl reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}
