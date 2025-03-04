'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconClipboard } from '@tabler/icons-react';

import { ResourceDescribe } from '@/components/Features/Velero/Commons/Forms/ResourceDescribe';

interface DescribeActionIconProps {
  resourceType: string;
  record: any;
}

export default function DescribeActionIcon({ resourceType, record }: DescribeActionIconProps) {
  return (
    <Tooltip label="Describe">
      <ActionIcon
        size="sm"
        variant="subtle"
        disabled={
          record.status?.phase !== undefined && record.status.phase.toLowerCase() === 'inprogress'
        }
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: `${resourceType} describe ${record.metadata.name}`,
            size: '80%',
            children: (
              <ResourceDescribe resourceType={resourceType} resourceName={record.metadata.name} />
            ),
          });
        }}
      >
        <IconClipboard />
      </ActionIcon>
    </Tooltip>
  );
}
