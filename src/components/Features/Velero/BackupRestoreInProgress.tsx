'use client';

import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Group, Center, Anchor, Text, Progress } from '@mantine/core';
import { IconClick, IconDeviceFloppy, IconRestore } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
// import { useAppStatus } from '@/contexts/AppContext';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useStatsInProgress } from '@/api/Stats/useStatsInProgress';

import { getExpirationString } from '@/utils/getExpirationString';

import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import VeleroResourceStatusBadge from '@/components//Features/Velero/Commons/Display/VeleroResourceStatusBadge';
// import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

export default function BackupRestoreInProgress({
                                                  reload,
                                                  setReload,
                                                  active,
                                                  setFetchingData,
                                                }: any) {
  const router = useRouter();
  // const appValues = useAppStatus();
  const agentValues = useAgentStatus();

  const {
    data,
    getStatsInProgress,
    fetching
  } = useStatsInProgress();

  const [records, setRecords] = useState<Array<any>>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'restores') {
      setReload((prev: number) => prev + 1);
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
    if (agentValues.isAgentAvailable) {
      getStatsInProgress();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data !== undefined) {
      const data_sorted = sortBy(data, sortStatus.columnAccessor);
      const data_order = sortStatus.direction === 'desc' ? data_sorted.reverse() : data_sorted;
      setRecords(data_order);
    } else {
      setRecords([]);
    }
  }, [data, sortStatus]);

  useEffect(() => {
    if (records.length > 0) {
      const data_sorted = sortBy(records, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === 'desc' ? records.reverse() : data_sorted);
    }
  }, [sortStatus]);

  useEffect(() => {
    if (!active) return undefined;
    getStatsInProgress();
    return undefined;
    /*const interval = setInterval(() => {
      getStatsInProgress();
    }, appValues.refreshRecent);
    return () => clearInterval(interval);*/
  }, [agentValues.currentAgent, agentValues.isAgentAvailable, active]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="left" wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind.toLowerCase()} record={record}/>
      {record.kind.toLowerCase() === 'backup' && (
        <DeleteAction resourceType="backup" record={record} setReload={setReload}/>
      )}
    </Group>
  );

  return (
    <DataTable
      height={194}
      withTableBorder
      borderRadius="sm"
      // withColumnBorders
      striped
      highlightOnHover
      idAccessor="metadata.name"
      records={records}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      pinLastColumn
      columns={[
        {
          accessor: 'kind',
          title: 'Kind',
          width: 80,
          ellipsis: true,
        },
        {
          accessor: 'metadata.name',
          title: 'Name',
          sortable: true,
          width: 250,
          ellipsis: true,
          render: (record: Record<string, any>) => (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/${record?.kind?.toLowerCase()}s/${record?.metadata?.name}`);
              }}
            >
              <Group gap={5}>
                {record?.kind === 'Backup' && <IconDeviceFloppy size={16}/>}
                {record?.kind === 'Restore' && <IconRestore size={16}/>}
                <Text>{record?.metadata?.name}</Text>
              </Group>
            </Anchor>
          ),
        },
        {
          accessor: 'metadata.labels["velero.io/schedule-name"]',
          title: 'Schedules',
          render: ({ metadata }: any) => {
            if (metadata.labels !== undefined && 'velero.io/schedule-name' in metadata.labels) {
              return <>{metadata.labels['velero.io/schedule-name']}</>;
            }
            return <></>;
          },
          sortable: true,
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'status.phase',
          title: 'Status',
          sortable: true,
          width: 120,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined}/>
          ),
        },
        {
          accessor: 'status.progress.itemsBackedUp',
          title: 'Progress',
          sortable: true,
          width: 120,
          ellipsis: true,
          render: ({ status }: any) => {
            const progressValue =
              status?.progress?.itemsBackedUp ?? status?.progress?.itemsRestored;
            const totalValue = status?.progress?.totalItems;

            return (
              <>
                {progressValue && totalValue && (
                  <Progress.Root size={20}>
                    <Progress.Section
                      animated={Number(progressValue) / Number(totalValue) !== 1}
                      color="var(--mantine-primary-color-filled)"
                      value={(100 * Number(progressValue)) / Number(totalValue)}
                    >
                      <Progress.Label>
                        {Math.round((100 * Number(progressValue)) / Number(totalValue))}%
                      </Progress.Label>
                    </Progress.Section>
                  </Progress.Root>
                )}
              </>
            );
          }
        },
        {
          accessor: 'status.errors',
          title: 'Errors',
          sortable: true,
          width: 100,
          ellipsis: true,
        },
        {
          accessor: 'status.warnings',
          title: 'Warnings',
          sortable: true,
          width: 100,
          ellipsis: true,
        },
        {
          accessor: 'status.startTimestamp',
          title: 'Start',
          sortable: true,
          width: 180,
          ellipsis: true,
        },
        {
          accessor: 'status.completionTimestamp',
          title: 'Completion',
          sortable: true,
          width: 180,
          ellipsis: true,
        },
        {
          accessor: 'status.expire_in',
          title: 'Expires in',
          sortable: true,
          render: ({ status }: any) => getExpirationString(status?.expiration),
          width: 100,
          ellipsis: true,
        },
        {
          accessor: 'actions',
          title: (
            <Center>
              <IconClick size={16}/>
            </Center>
          ),
          width: '0%',
          render: renderActions,
        },
      ]}
    />
  );
}
