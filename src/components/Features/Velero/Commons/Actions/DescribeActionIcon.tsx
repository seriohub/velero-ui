'use client';

import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { openModal, closeAllModals } from '@mantine/modals';

import { IconClipboard } from '@tabler/icons-react';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

interface DescribeActionIconProps {
  resourceType: string;
  record: any;
}

export default function DescribeActionIcon({ resourceType, record }: DescribeActionIconProps) {
  /*<ResourceDescribe resourceType={resourceType} resourceName={record.metadata.name} />*/

  return (
    <Tooltip label="Describe">
      <ActionIcon
        size="sm"
        variant="subtle"
        /*disabled={
          record.status?.phase !== undefined && record.status.phase.toLowerCase() === 'inprogress'
        }*/
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            withCloseButton: false,
            title: null,
            size: '100rem',
            children: (
              <>
                <Manifest
                  resourceType={resourceType}
                  resourceName={record.metadata.name}
                  h={800}
                />
                <Group justify="flex-end" mt="md">
                  <Button onClick={() => closeAllModals()}>Close</Button>
                </Group>
              </>
            ),
          });
        }}
      >
        <IconClipboard />
      </ActionIcon>
    </Tooltip>
  );
}
