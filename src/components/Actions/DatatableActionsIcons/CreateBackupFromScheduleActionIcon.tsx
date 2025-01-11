'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconDeviceFloppy } from '@tabler/icons-react';

import { CreateBackupFromSchedule } from '../ActionsForm/CreateBackupFromSchedule';

interface CreateBackupFromScheduleActionIconProps {
  record: any;
}

export default function CreateBackupFromScheduleActionIcon({
  record,
}: CreateBackupFromScheduleActionIconProps) {
  return (
    <Tooltip label="Create backup">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Create bakup from schedule ${record.metadata.name}`,
            children: <CreateBackupFromSchedule scheduleName={record.metadata.name} />,
          });
        }}
      >
        <IconDeviceFloppy />
      </ActionIcon>
    </Tooltip>
  );
}
