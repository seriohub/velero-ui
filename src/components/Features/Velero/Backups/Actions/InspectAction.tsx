'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconZoomCode } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useInspectBackup } from '@/api/Backup/useBackupInspect';

interface RestoreActionIconProps {
  record: {
    metadata?: { name: string };
    status?: { phase: string };
  };
  buttonType?: 'actionIcon' | 'button';
}

const InspectAction: React.FC<RestoreActionIconProps> = ({
                                                           record,
                                                           buttonType = 'actionIcon'
                                                         }) => {
  const isDisabled = ['inprogress', 'new'].includes(record?.status?.phase.toLowerCase() ?? '');

  const backupName = record?.metadata?.name || 'Unknown';
  const {
    data,
    inspectBackup
  } = useInspectBackup();

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    notifications.show({
      title: 'Download for inspect requested',
      message: 'Will soon be available on the inspect page',
    });
    inspectBackup(backupName);
  };
  return buttonType === 'actionIcon' ? (
    <Tooltip label="Download for inspect">
      <ActionIcon size="sm" variant="subtle" disabled={isDisabled} onClick={handleOpenModal}>
        <IconZoomCode/>
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconZoomCode/>} disabled={isDisabled} onClick={handleOpenModal}>
      Download for inspect
    </Button>
  );
};

export default InspectAction;
