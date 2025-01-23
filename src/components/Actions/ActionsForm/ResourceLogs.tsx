'use client';

import { useEffect } from 'react';

import { Logs } from '@/components/Velero/Logs/Logs';
import { useResourceLogs } from '@/api/Velero/useResourceLogs';

interface ResourceLogsProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceLogs({ resourceType, resourceName }: ResourceLogsProps) {
  const { data, getResourceLogs, error, fetching } = useResourceLogs();

  useEffect(() => {
    if (resourceName) {
      getResourceLogs(resourceType, resourceName);
    }
  }, [resourceName]);

  return <Logs items={data !== undefined ? data.payload : []} fetching={fetching} error={error} />;
}
