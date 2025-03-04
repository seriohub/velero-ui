'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconClipboard } from '@tabler/icons-react';

import { JsonViewer } from '@/components/Features/Velero/Commons/Display/JsonViewer';

interface DetailActionIconProps {
  name: string;
  record: any;
}

export default function DetailActionIcon({ name, record }: DetailActionIconProps) {
  return (
    <Tooltip label="Describe">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `Detail ${name}`,
            size: '80%',
            children: <JsonViewer record={record} />,
          });
        }}
      >
        <IconClipboard />
      </ActionIcon>
    </Tooltip>
  );
}
