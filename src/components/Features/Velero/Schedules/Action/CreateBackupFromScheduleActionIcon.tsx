'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconDeviceFloppy } from '@tabler/icons-react';

import { CreateBackupFromSchedule } from '@/components/Features/Velero/Schedules/Forms/CreateBackupFromSchedule';
import { useUIStatus } from '@/contexts/UIContext';

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
        variant="subtle"
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
