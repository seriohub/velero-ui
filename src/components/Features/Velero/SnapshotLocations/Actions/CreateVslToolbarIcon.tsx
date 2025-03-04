import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateVslForm } from '@/components/Features/Velero/SnapshotLocations/Forms/CreateVslForm';

interface CreateVslToolbarIconProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
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
            size: '60rem',
            children: <CreateVslForm reload={reload} setReload={setReload} />,
            padding: 'md',
            radius: 'md',
            centered: true,
          });
        }}
      >
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}
