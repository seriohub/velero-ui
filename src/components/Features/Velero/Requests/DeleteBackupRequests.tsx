'use client';

import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Group, Center } from '@mantine/core';
import { IconClick } from '@tabler/icons-react';

import { useAppStatus } from '@/contexts/AppContext';

import { useAgentStatus } from '@/contexts/AgentContext';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

import { useDownloadBackupRequests } from '@/api/Requests/useDownloadBackupRequests';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';

export default function DeleteBackupRequests({ reload, setReload, active, setFetchingData }: any) {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();

  const { data, getDownloadBackupRequests, fetching } = useDownloadBackupRequests();

  const [records, setRecords] = useState<Array<any>>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Name',
    direction: 'asc',
  });

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'deletebackuprequests') {
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
      getDownloadBackupRequests();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data?.items !== undefined) {
      const data_sorted = sortBy(data.items, sortStatus.columnAccessor);
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
    getDownloadBackupRequests();
    const interval = setInterval(() => {
      getDownloadBackupRequests();
    }, appValues.refreshRecent);
    return () => clearInterval(interval);
  }, [agentValues.currentAgent, agentValues.isAgentAvailable, active]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="left" wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind} record={record} />

      {/*<DeleteAction resourceType="downloadrequest" record={record} setReload={setReload} />*/}
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
          accessor: 'metadata.name',
          title: 'Name',
          sortable: true,
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'spec.backupName',
          title: 'Target Backup Name',
          sortable: true,
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'status.phase',
          title: 'Status',
          sortable: true,
          width: 100,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined} />
          ),
        },
        {
          accessor: 'status.errors',
          title: 'Errors',
          sortable: true,
          width: 500,
          ellipsis: true,
        },
        {
          accessor: 'actions',
          title: (
            <Center>
              <IconClick size={16} />
            </Center>
          ),
          width: '0%',
          render: renderActions,
        },
      ]}
    />
  );
}
