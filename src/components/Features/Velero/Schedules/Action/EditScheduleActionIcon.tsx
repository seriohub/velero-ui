'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconEdit } from '@tabler/icons-react';

import { EditSchedule } from '../Forms/EditSchedule';

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
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Edit Schedules',
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
