'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateSchedule } from '../Forms/CreateSchedule';

interface CreateSecheduleToolbarIconProps {
  reload: number;
  setReload: any;
}

export default function CreateSecheduleToolbarIcon({
  reload,
  setReload,
}: CreateSecheduleToolbarIconProps) {
  return (
    <Tooltip label="Create schedule">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Schedules',
            size: 'xl',
            children: <CreateSchedule reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus stroke="1.5" />
      </ActionIcon>
    </Tooltip>
  );
}
