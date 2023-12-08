'use client';

import { useEffect } from 'react';

import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import { Logs } from '@/components/Logs/logs';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceLogs({ resourceType, resourceName }: ResourceLogsProps) {
  const { data, getData, error, fetching } = useApiWithGet();

  useEffect(() => {
    getData(`/api/v1/${resourceType}/logs`, `resource_name=${resourceName}`);
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
