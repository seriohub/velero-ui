'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useDownloadBackup } from '@/api/Backup/useBackupDownload';

interface RestoreActionIconProps {
  record: {
    metadata?: { name: string };
    status?: { phase: string };
  };
  buttonType?: 'actionIcon' | 'button';
}

const DownloadAction: React.FC<RestoreActionIconProps> = ({
  record,
  buttonType = 'actionIcon',
}) => {
  const isDisabled = ['inprogress', 'new'].includes(record?.status?.phase.toLowerCase() ?? '');

  const backupName = record?.metadata?.name || 'Unknown';
  const { data, downloadBackup } = useDownloadBackup();

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    notifications.show({
      title: 'Download requested',
      message: 'The download will start automatically as soon as it is ready',
    });
    downloadBackup(backupName);
  };

  useEffect(() => {
    if (data) {
      const a = document.createElement('a');
      a.href = data?.url;
      a.download = `${backupName}.tar.gz`; // Assumendo che sia un file zip, cambiare estensione se necessario
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [data, backupName]);

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Download">
      <ActionIcon size="sm" variant="subtle" disabled={isDisabled} onClick={handleOpenModal}>
        <IconDownload />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconDownload />} disabled={isDisabled} onClick={handleOpenModal}>
      Download
    </Button>
  );
};

export default DownloadAction;
