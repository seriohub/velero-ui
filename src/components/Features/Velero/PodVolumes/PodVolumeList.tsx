'use client';

import React, { useEffect, useState } from 'react';

import { Anchor, Text } from '@mantine/core';

import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { DataTable } from 'mantine-datatable';
import { useAgentStatus } from '@/contexts/AgentContext';

import { usePodVolumeDetails } from '@/api/PodVolumeBackups/usePodVolumeDetails';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))}${sizes[i]}`;
}

interface PVBSummaryProps {
  podVolumeName: string;
  type: string;
}

export function PodVolumeList({ podVolumeName, type }: PVBSummaryProps) {
  const { data, getPodVolumeDetails } = usePodVolumeDetails();
  const [records, setRecords] = useState<Array<any>>([]);
  const agentValues = useAgentStatus();
  const [reload, setReload] = useState(1);
  const router = useRouter();

  /* watch */
  useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'podvolumebackups') {
      setReload((prev) => prev + 1);
    }
  }, 250);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    if (type === 'podvolumebackups') {
      getPodVolumeDetails(podVolumeName, 'PodVolumeBackup');
    } else {
      getPodVolumeDetails(podVolumeName, 'PodVolumeRestore');
    }
  }, [agentValues.isAgentAvailable, reload]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setRecords(data);
    }
  }, [data]);

  return (
    <>
      <DataTable
        height="394px"
        withTableBorder
        striped
        idAccessor="metadata.name"
        columns={[
          {
            accessor: 'metadata.name',
            title: 'Name',
            render: ({ metadata }) => (
              <Anchor
                size="sm"
                onClick={() => {
                  // console.log(record);
                  router.push(
                    `/${type === 'podvolumebackups' ? 'pod-volume-backups' : 'pod-volume-restores'}/${metadata?.name}`
                  );
                }}
              >
                {metadata.name}
              </Anchor>
            ),
          },
          {
            accessor: 'spec.pod.name',
            title: 'Pod Name',
          },
          {
            accessor: 'spec.tags.volume',
            title: 'Volume',
          },
          {
            accessor: 'status.phase',
            title: 'Phase',
            sortable: true,
            ellipsis: true,
            render: ({ status }) => (
              <VeleroResourceStatusBadge status={status?.phase || undefined} />
            ),
          },
          {
            accessor: 'status.progress',
            title: 'Size',
            sortable: true,
            ellipsis: true,
            render: ({ status }) => (
              <>
                {status?.progress?.totalBytes && (
                  <Text c="dimmed" size="sm" ta="right">
                    {status?.phase !== 'Completed' && (
                      <>
                        {formatBytes(status?.progress?.bytesDone)} /
                        {formatBytes(status?.progress?.totalBytes)}
                      </>
                    )}
                    {status?.phase === 'Completed' && (
                      <>{formatBytes(status.progress.totalBytes)}</>
                    )}
                  </Text>
                )}
              </>
            ),
          },
        ]}
        records={records}
      />
    </>
  );
}
