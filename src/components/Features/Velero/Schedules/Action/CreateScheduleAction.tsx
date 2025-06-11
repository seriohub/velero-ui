import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { CreateScheduleForm } from '@/components/Features/Velero/Schedules/Forms/CreateScheduleForm';

export default function CreateScheduleAction() {
  return (
    <Tooltip label="New schedule">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Schedules',
            size: '60rem',
            children: <CreateScheduleForm/>,
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
