'use client';

import { useEffect } from 'react';

import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { Logs } from '@/components/Logs/Logs';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceLogs({ resourceType, resourceName }: ResourceLogsProps) {
  const { data, getData, error, fetching } = useApiGet();

  useEffect(() => {
    getData({ url: `/v1/${resourceType}/logs`, param: `resource_name=${resourceName}` });
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
