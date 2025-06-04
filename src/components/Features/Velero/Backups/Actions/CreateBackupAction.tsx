import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { CreateBackupForm } from '@/components/Features/Velero/Backups/Forms/CreateBackupForm';

export default function CreateBackupAction() {
  return (
    <Tooltip label="New Backup">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Backup',
            size: '60rem',
            children: <CreateBackupForm/>,
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
