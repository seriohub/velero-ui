import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { CreateBslForm } from '@/components/Features/Velero/BackupLocations/Forms/CreateBslForm';

interface CreateBslToolbarIconProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateBslToolbar({
                                           reload,
                                           setReload
                                         }: CreateBslToolbarIconProps) {
  return (
    <Tooltip label="New Backup Storage Location">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            modalId: 'newBSL',
            title: 'Create New Backups Storage Location',
            size: '60rem',
            children: <CreateBslForm reload={reload} setReload={setReload}/>,
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
