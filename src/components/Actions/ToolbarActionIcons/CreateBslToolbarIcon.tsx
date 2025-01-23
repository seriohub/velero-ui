'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateBsl } from '@/components/Actions/ActionsForm/CreateBsl';

interface CreateBslToolbarIconProps {
  reload: number;
  setReload: any;
}

export default function CreateBslToolbarIcon({ reload, setReload }: CreateBslToolbarIconProps) {
  return (
    <Tooltip label="Create BSL">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            modalId: 'newBSL',
            title: 'Create New Backups Storage Location',
            size: 'xl',
            children: <CreateBsl reload={reload} setReload={setReload} />,
          });
        }}
      >
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}
