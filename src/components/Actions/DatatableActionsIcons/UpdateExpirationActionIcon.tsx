'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconClockCog } from '@tabler/icons-react';

import { UpdateExpiration } from '../ActionsForm/UpdateExpiration';

interface DetailActionIconProps {
  record: any;
}

export default function UpdateExpirationActionIcon({ record }: DetailActionIconProps) {
  return (
    <>
        <Tooltip label="Update Expiration">
          <ActionIcon
            size="sm"
            variant="transparent"
            onClick={(e) => {
              e.stopPropagation();
              openModal({
                title: `Update Expiration backup ${record.metadata.name}`,
                size: 'md',
                children: (
                  <UpdateExpiration
                    record={record}
                  />
                ),
              });
            }}
          >
            <IconClockCog color="orange" />
          </ActionIcon>
        </Tooltip>
    </>
  );
}
