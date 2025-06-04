'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Center } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

import { useResourceLogs } from '@/api/Velero/useResourceLogs';

import { LogsView } from '@/components/Features/Velero/Logs/LogsView';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;

  [key: string]: any;
}

export function ResourceLogs({
                               resourceType,
                               resourceName,
                               ...rest
                             }: ResourceLogsProps) {
  const {
    data,
    getResourceLogs,
    fetching
  } = useResourceLogs();

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (resourceName && refresh > 0) {
      getResourceLogs(resourceType, resourceName);
    }
  }, [resourceName, refresh]);

  return (
    <Box h="100px">
      {refresh === 0 && (
        <Center mt={50}>
          <Button onClick={() => setRefresh((prev) => prev + 1)} rightSection={<IconDownload/>}>Download logs</Button>
        </Center>
      )}
      {refresh > 0 && (
        <LogsView items={isRecordStringAny(data) ? data : []} fetching={fetching} {...rest}/>
      )}
    </Box>
  );
}
