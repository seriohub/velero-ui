'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconClipboard } from '@tabler/icons-react';

import { Detail } from '../ActionsForm/Detail';

interface DetailActionIconProps {
  name: string;
  record: any;
}

export default function DetailActionIcon({ name, record }: DetailActionIconProps) {
  return (
    <Tooltip label="Describe">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Detail ${name}`,
            size: '80%',
            children: <Detail record={record} />,
          });
        }}
      >
        <IconClipboard />
      </ActionIcon>
    </Tooltip>
  );
}
