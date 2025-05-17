'use client';

import { ActionIcon, Tooltip, rem } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconDownload } from '@tabler/icons-react';

import { InfoDataResponse } from './InfoDataResponse';

interface InfoDataResponseIconProps {
  data: any;
}

export default function InfoDataResponseIcon({ data }: InfoDataResponseIconProps) {

  return (
    <Tooltip label="Data">
      <ActionIcon
        // size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Data',
            size: '80%',
            children: <InfoDataResponse data={data}/>,
          });
        }}
      >
        <IconDownload
          style={{
            height: rem(14),
            width: rem(14),
          }}
          color="green"
        />
      </ActionIcon>
    </Tooltip>
  );
}
