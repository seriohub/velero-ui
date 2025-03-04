import React from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconEdit } from '@tabler/icons-react';

import { EditScheduleForm } from '../Forms/EditScheduleForm';

interface EditScheduleActionProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  buttonType?: 'actionIcon' | 'button';
}

export default function EditScheduleAction({
  record,
  setReload,
  buttonType = 'actionIcon',
}: EditScheduleActionProps) {
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      title: 'Edit Schedules',
      size: '60rem',
      children: <EditScheduleForm record={record} setReload={setReload} />,
      padding: 'md',
      radius: 'md',
      centered: true,
    });
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Edit">
      <ActionIcon size="sm" variant="subtle" onClick={handleOpenModal}>
        <IconEdit color="green" />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconEdit />} onClick={handleOpenModal}>
      Edit
    </Button>
  );
}
