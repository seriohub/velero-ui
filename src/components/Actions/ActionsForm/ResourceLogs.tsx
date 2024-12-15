'use client';

import { useEffect } from 'react';

import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { Logs } from '@/components/Velero/Logs/Logs';
import { useResourceLogs } from '@/api/Velero/useResourceLogs';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceLogs({ resourceType, resourceName }: ResourceLogsProps) {
  const { data, getResourceLogs, error, fetching } = useResourceLogs();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 240 has been called`, `color: green; font-weight: bold;`);
    getResourceLogs(resourceType, resourceName);
  }, [resourceName]);

  return (
    <>
      <Stack h="calc(100vh - 80px)" justify="space-between">
        <Logs items={data !== undefined ? data.payload : []} fetching={fetching} error={error} />

        <Group justify="flex-end">
          <Button onClick={() => closeAllModals()}>Close</Button>
        </Group>
      </Stack>
    </>
  );
}
