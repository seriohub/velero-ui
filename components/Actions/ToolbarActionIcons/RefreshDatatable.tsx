'use client';

import { ActionIcon } from '@mantine/core';

import { IconReload } from '@tabler/icons-react';

export default function RefreshDatatable({ setReload, reload, fetching = false }: any) {
  return (
    <ActionIcon
      onClick={(e) => {
        e.stopPropagation();
        setReload(reload + 1);
      }}
      size={30}
      variant={fetching ? 'filled' : 'default'}
      aria-label="ActionIcon with size as a number"
    >
      <IconReload style={{ width: '70%', height: '70%' }} />
    </ActionIcon>
  );
}
