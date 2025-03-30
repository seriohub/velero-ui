'use client';

import { useEffect } from 'react';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { usePodsLogs } from "@/api/Velero/usePodsLogs";
import { LogsView } from "@/components/Features/Velero/Logs/LogsView";

interface ManifestProps {
  podName: string;
  target?: string;
}

export function PodLogsContent({
                                 podName,
                                 target = 'velero'
                               }: ManifestProps) {

  const {
    data,
    getPodLogs,
    fetching
  } = usePodsLogs();

  useEffect(() => {
    getPodLogs(podName, target);
  }, []);

  return (
    <LogsView items={isRecordStringAny(data) ? data : []} fetching={fetching} h={800}/>
  );
}
