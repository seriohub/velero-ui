'use client';

import { useEffect, useState } from 'react';

import { Button, Center, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useResourceLogs } from '@/api/Velero/useResourceLogs';

import { LogsView } from '@/components/Features/Velero/Logs/LogsView';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceLogs({ resourceType, resourceName }: ResourceLogsProps) {
  const isNavbarHidden = useMediaQuery('(max-width: 576px)');
  const { data, getResourceLogs, error, fetching } = useResourceLogs();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (resourceName && refresh > 0) {
      getResourceLogs(resourceType, resourceName);
    }
  }, [resourceName, refresh]);

  return (
    <>
      {refresh === 0 && (
        <Center mt={50}>
          <Button onClick={() => setRefresh((prev) => prev + 1)}>Download logs</Button>
        </Center>
      )}
      {refresh > 0 && (
        <ScrollArea
          bg="var(--mantine-color-body)"
          type="always"
          w={
            isNavbarHidden
              ? 'calc(100vw - 5px)'
              : 'calc(100vw - var(--app-shell-navbar-width) - 25px)'
          }
          h={394}
        >
          <LogsView items={isRecordStringAny(data) ? data : []} fetching={fetching} />
        </ScrollArea>
      )}
    </>
  );
}
