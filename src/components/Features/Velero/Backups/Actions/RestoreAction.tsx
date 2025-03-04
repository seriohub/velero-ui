'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconRestore } from '@tabler/icons-react';
import { CreateRestoreForm } from '../../Restores/Form/CreateRestoreForm';

interface RestoreActionIconProps {
  record: {
    metadata?: { name: string };
    status?: { phase: string };
  };
  setReload: React.Dispatch<React.SetStateAction<number>>;
  buttonType?: 'actionIcon' | 'button';
}

const RestoreAction: React.FC<RestoreActionIconProps> = ({
  record,
  setReload,
  buttonType = 'actionIcon',
}) => {
  const isDisabled = record?.status?.phase !== 'Completed';
  const backupName = record?.metadata?.name || 'Unknown';

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      title: `Restore Backup ${backupName}`,
      size: '60rem',
      children: <CreateRestoreForm backupName={backupName} setReload={setReload} />,
      padding: 'md',
      radius: 'md',
      centered: true,
    });
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Restore">
      <ActionIcon size="sm" variant="subtle" disabled={isDisabled} onClick={handleOpenModal}>
        <IconRestore color="green" />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button
      h={38}
      leftSection={<IconRestore />}
      color="green"
      disabled={isDisabled}
      onClick={handleOpenModal}
    >
      Restore
    </Button>
  );
};

export default RestoreAction;
