'use client';

import { ActionIcon, Tooltip, rem } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconUpload } from '@tabler/icons-react';

import { InfoPostParameters } from './InfoPostParameters';

interface InfoParamActionIconProps {
  params: any;
}
export default function InfoParamActionIcon({ params }: InfoParamActionIconProps) {
  return (
    <Tooltip label="Params">
      <ActionIcon
        // size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Params',
            size: '80%',
            children: <InfoPostParameters params={params} />,
          });
        }}
      >
        <IconUpload style={{ height: rem(14), width: rem(14) }} color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
