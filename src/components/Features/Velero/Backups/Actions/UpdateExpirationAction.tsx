'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconHourglass } from '@tabler/icons-react';
import { UpdateExpirationForm } from '../Forms/UpdateExpirationForm';

interface UpdateExpirationActionIconProps {
  record: Record<string, any>;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  buttonType?: 'actionIcon' | 'button';
}

const UpdateExpirationAction: React.FC<UpdateExpirationActionIconProps> = ({
  record,
  setReload,
  buttonType = 'actionIcon',
}) => {
  const backupName = record?.metadata?.name || 'Unknown';
  const isDisabled = ['inprogress', 'new'].includes(record?.status?.phase.toLowerCase() ?? '');
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      title: `Update Expiration backup ${backupName}`,
      size: 'lg',
      children: <UpdateExpirationForm record={record} setReload={setReload} />,
    });
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Update Expiration">
      <ActionIcon size="sm" variant="subtle" onClick={handleOpenModal} disabled={isDisabled}>
        <IconHourglass />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconHourglass />} onClick={handleOpenModal} disabled={isDisabled}>
      Update Expiration
    </Button>
  );
};

export default UpdateExpirationAction;
