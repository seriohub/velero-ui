import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateBackupForm } from '../Forms/CreateBackupForm';

export default function CreateBackupAction() {
  return (
    <Tooltip label="Create backup">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
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
      >
        <IconPlus
          style={{
            width: '70%',
            height: '70%',
          }}
        />
      </ActionIcon>
    </Tooltip>
  );
}
