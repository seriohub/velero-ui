'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateSchedule } from '../ActionsForm/CreateSchedule';

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
        size={30}
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Schedule',
            size: 'lg',
            children: <CreateSchedule reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Tooltip>
  );
}
