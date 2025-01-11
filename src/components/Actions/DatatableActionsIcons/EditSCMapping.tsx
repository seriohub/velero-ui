'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconEdit } from '@tabler/icons-react';

import { SCMappingForm } from '../ActionsForm/SCMappingForm';

interface EditSCMappingProps {
  record: any;
  reload: number;
  setReload: any;
}

export default function EditSCMapping({
  record,
  reload,
  setReload,
}: EditSCMappingProps) {
  return (
    <Tooltip label="Edit">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Edit Storage Class Mapping',
            size: 'lg',
            children: <SCMappingForm record={record} reload={reload} setReload={setReload} mode="update"/>,
          });
        }}
      >
        <IconEdit color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
