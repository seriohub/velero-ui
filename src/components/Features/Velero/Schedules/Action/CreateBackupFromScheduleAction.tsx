'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';
import {
  CreateBackupFromScheduleForm
} from '@/components/Features/Velero/Schedules/Forms/CreateBackupFromScheduleForm';

interface CreateBackupFromScheduleActionProps {
  record: any;
  buttonType?: 'actionIcon' | 'button';
}

const CreateBackupFromScheduleAction: React.FC<CreateBackupFromScheduleActionProps> = ({
                                                                                         record,
                                                                                         buttonType = 'actionIcon',
                                                                                       }) => {
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      title: `Create backup from schedule ${record.metadata.name}`,
      children: <CreateBackupFromScheduleForm scheduleName={record.metadata.name}/>,
    });
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Create backup">
      <ActionIcon size="sm" variant="subtle" onClick={handleOpenModal}>
        <IconDeviceFloppy/>
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconDeviceFloppy/>} onClick={handleOpenModal}>
      Create Backup
    </Button>
  );
};

export default CreateBackupFromScheduleAction;
