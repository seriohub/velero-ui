'use client';

import { useEffect, useState } from 'react';

import { Button, Center, ScrollArea, Tabs } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
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
    <Tabs defaultValue="Logs" h={420}>
      <Tabs.List>
        <Tabs.Tab value="Logs" leftSection={<IconFileText size={12} />}>
          Logs
        </Tabs.Tab>
        {/*<Tabs.Tab value="LogsTable" leftSection={<IconTable size={12} />}>
          Logs Table
        </Tabs.Tab>*/}
      </Tabs.List>

      <Tabs.Panel value="Logs">
        {refresh === 0 && (
          <Center mt={50}>
            <Button onClick={() => setRefresh((prev) => prev + 1)}>Download logs</Button>
          </Center>
        )}
        {refresh > 0 && (
          <ScrollArea
            type="always"
            w={
              isNavbarHidden
                ? 'calc(100vw - 5px)'
                : 'calc(100vw - var(--app-shell-navbar-width) - 25px)'
            }
            h={400}
          >
            <LogsView items={isRecordStringAny(data) ? data : []} fetching={fetching} />
          </ScrollArea>
        )}
      </Tabs.Panel>

      {/*
      <Tabs.Panel value="LogsTable">
        {refresh === 0 && (
          <Center mt={50}>
            <Button onClick={() => setRefresh((prev) => prev + 1)}>Download logs</Button>
          </Center>
        )}

        {refresh > 0 && (
          <LogsTable
            items={data?.table !== undefined && Array.isArray(data?.table) ? data?.table : []}
            fetching={fetching}
            error={error}
          />
        )}
      </Tabs.Panel>
      */}
    </Tabs>
  );
}
