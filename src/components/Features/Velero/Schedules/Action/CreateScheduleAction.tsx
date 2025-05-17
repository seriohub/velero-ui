import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateScheduleForm } from '../Forms/CreateScheduleForm';

interface CreateSecheduleToolbarIconProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateSecheduleAction({
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
            size: '60rem',
            children: <CreateScheduleForm reload={reload} setReload={setReload}/>,
            padding: 'md',
            radius: 'md',
            centered: true,
          });
        }}
      >
        <IconPlus stroke="1.5"/>
      </ActionIcon>
    </Tooltip>
  );
}
