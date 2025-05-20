'use client';

import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Group, Center, Tooltip, ActionIcon, rem, CopyButton } from '@mantine/core';
import { IconCheck, IconClick, IconCopy } from '@tabler/icons-react';

// import { useAppStatus } from '@/contexts/AppContext';

import { debounce } from 'lodash';
import { useAgentStatus } from '@/contexts/AgentContext';

import { getExpirationString } from '@/utils/getExpirationString';

import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

import { useDownloadRequests } from '@/api/Requests/useDownloadRequests';
import DownloadAction from '@/components/Features/Velero/Requests/Actions/DownloadAction';
import { eventEmitter } from '@/lib/EventEmitter.js';

export default function DownloadRequests({
                                           reload,
                                           setReload,
                                           active,
                                           setFetchingData
                                         }: any) {
  // const appValues = useAppStatus();
  const agentValues = useAgentStatus();

  const {
    data,
    getDownloadRequests,
    fetching
  } = useDownloadRequests();

  const [records, setRecords] = useState<Array<any>>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Name',
    direction: 'asc',
  });

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'downloadrequests') {
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
      getDownloadRequests();
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
    getDownloadRequests();
    return undefined;
    /*const interval = setInterval(() => {
      getDownloadRequests();
    }, appValues.refreshRecent);
    return () => clearInterval(interval);*/
  }, [agentValues.currentAgent, agentValues.isAgentAvailable, active]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="left" wrap="nowrap">
      <CopyButton value={record?.status?.downloadURL} timeout={2000}>
        {({
            copied,
            copy
          }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy URL'} withArrow position="right">
            <ActionIcon color={copied ? 'teal' : ''} variant="transparent" onClick={copy}>
              {copied ? (
                <IconCheck
                  style={{
                    height: rem(18),
                    width: rem(18),
                  }}
                />
              ) : (
                <IconCopy
                  style={{
                    height: rem(18),
                    width: rem(18),
                  }}
                />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <DownloadAction url={record?.status?.downloadURL || undefined}/>
      <DeleteAction resourceType="downloadrequest" record={record} setReload={setReload}/>
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
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'spec.target.kind',
          title: 'Target Kind',
          sortable: true,
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'spec.target.name',
          title: 'Target Name',
          sortable: true,
          width: 200,
          ellipsis: true,
        },
        {
          accessor: 'status.phase',
          title: 'Status',
          sortable: true,
          width: 150,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined}/>
          ),
        },
        {
          accessor: 'status.expire_in',
          title: 'Expires in',
          sortable: true,
          render: ({ status }: any) => getExpirationString(status?.expiration),
          width: 200,
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
