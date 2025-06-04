import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { CreateVslForm } from '@/components/Features/Velero/SnapshotLocations/Forms/CreateVslForm';

interface CreateVslToolbarIconProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateVslToolbar({
                                           reload,
                                           setReload
                                         }: CreateVslToolbarIconProps) {
  return (
    <Tooltip label="Create VSL">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            modalId: 'newVSL',
            title: 'Create New Volume Snapshot Location',
            size: '60rem',
            children: <CreateVslForm reload={reload} setReload={setReload}/>,
            padding: 'md',
            radius: 'md',
            centered: true,
          });
        }}
        leftSection={<IconPlus/>}
      >
        New
      </Button>
    </Tooltip>
  );
}
