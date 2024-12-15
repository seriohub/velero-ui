'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconTrashX } from '@tabler/icons-react';

import { ResourceDelete } from '../ActionsForm/ResourceDelete';
import { SCMappingDelete } from '../ActionsForm/SCMappingDelete';

interface DeleteSCMappingActionIconProps {
  record: any;
  reload: number;
  setReload: any;
}

export default function DeleteSCMappingActionIcon({
  record,
  reload,
  setReload,
}: DeleteSCMappingActionIconProps) {
  return (
    <Tooltip label="Delete">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Delete Storage Class Mapping`,
            size: 'lg',
            children: (
              <SCMappingDelete
                record={record}
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
