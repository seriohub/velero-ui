'use client';

import { ActionIcon } from '@mantine/core';

import { IconRefresh } from '@tabler/icons-react';

export default function RefreshDatatable({ setReload, reload, fetching = false }: any) {
  return (
    <>
      <ActionIcon
        onClick={(e) => {
          e.stopPropagation();
          setReload(reload + 1);
        }}
        size={38}
        //variant="default"
        variant="outline"
        radius={8}
        disabled={fetching}
      >
        <IconRefresh stroke={1.5} />
      </ActionIcon>
    </>
  );
}