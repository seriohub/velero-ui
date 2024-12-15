'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconTrashX } from '@tabler/icons-react';

import { ResourceDelete } from '../ActionsForm/ResourceDelete';

interface DeleteActionIconProps {
  resourceType: string;
  record: any;
  reload: number;
  setReload: any;
}

export default function DeleteActionIcon({
  resourceType,
  record,
  reload,
  setReload,
}: DeleteActionIconProps) {
  return (
    <Tooltip label="Delete">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Delete ${resourceType}`,
            size: 'lg',
            children: (
              <ResourceDelete
                resourceType={resourceType}
                resourceName={record.metadata.name}
                reload={reload}
                setReload={setReload}
              />
            ),
          });
        }}
      >
        <IconTrashX size={16} color="red" />
      </ActionIcon>
    </Tooltip>
  );
}
