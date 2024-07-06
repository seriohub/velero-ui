'use client';

import { ActionIcon, Button } from '@mantine/core';

import { IconRefresh, IconReload } from '@tabler/icons-react';

export default function RefreshDatatable({ setReload, reload, fetching = false }: any) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        setReload(reload + 1);
      }}
      leftSection={<IconRefresh style={{ width: '70%', height: '70%' }} />}
      //size={30}
      variant={fetching ? 'filled' : 'default'}
      aria-label="ActionIcon with size as a number"
    >
      Refresh
    </Button>
  );
}
