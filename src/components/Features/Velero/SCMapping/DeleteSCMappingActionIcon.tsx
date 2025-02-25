'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconTrashX } from '@tabler/icons-react';

import { SCMappingDelete } from './Forms/SCMappingDelete';
import { useUIStatus } from '@/contexts/UIContext';

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
  const uiValues = useUIStatus();
  return (
    <Tooltip label="Delete">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Delete Storage Class Mapping',
            size: 'lg',
            children: <SCMappingDelete record={record} reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconTrashX color="red" />
      </ActionIcon>
    </Tooltip>
  );
}
