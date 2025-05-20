'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconTrashX } from '@tabler/icons-react';
import { ResourceDelete } from '@/components/Features/Velero/Commons/Forms/ResourceDelete';

interface DeleteActionIconProps {
  resourceType: string;
  record: {
    metadata?: { name: string };
  };
  setReload: React.Dispatch<React.SetStateAction<number>>;
  buttonType?: 'actionIcon' | 'button';
  redirectAfterDelete?: string;
}

const DeleteAction: React.FC<DeleteActionIconProps> = ({
                                                         resourceType,
                                                         record,
                                                         setReload,
                                                         buttonType = 'actionIcon',
                                                         redirectAfterDelete = '',
                                                       }) => {
  const resourceName = record?.metadata?.name || 'Unknown';

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      title: `Delete ${resourceType}`,
      size: 'lg',
      children: (
        <ResourceDelete
          resourceType={resourceType}
          resourceName={resourceName}
          setReload={setReload}
          redirectAfterDelete={redirectAfterDelete}
        />
      ),
    });
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label="Delete">
      <ActionIcon size="sm" variant="subtle" onClick={handleOpenModal}>
        <IconTrashX color="red"/>
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button h={38} leftSection={<IconTrashX/>} color="red" onClick={handleOpenModal}>
      Delete
    </Button>
  );
};

export default DeleteAction;
