'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconEdit } from '@tabler/icons-react';

import { EditSchedule } from '../ActionsForm/EditSchedule';

interface EditScheduleActionIconProps {
  record: any;
  reload: number;
  setReload: any;
}

export default function EditScheduleActionIcon({
  record,
  reload,
  setReload,
}: EditScheduleActionIconProps) {
  return (
    <Tooltip label="Edit">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Edit Schedule',
            size: 'lg',
            children: <EditSchedule record={record} reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconEdit color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
