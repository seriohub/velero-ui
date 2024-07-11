'use client';

import { useContext, useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import { Group, Center, Accordion, Text, rem, Tooltip } from '@mantine/core';

import { IconClick, IconClock, IconReload } from '@tabler/icons-react';

import sortBy from 'lodash/sortBy';

import { useApiGet } from '@/hooks/useApiGet';
import DescribeActionIcon from '../Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '../Actions/DatatableActionsIcons/LogsActionIcon';
import ExpireIn from '../Backup/ExpireIn';
import DeleteActionIcon from '../Actions/DatatableActionsIcons/DeleteActionIcon';

import { useAppState } from '@/contexts/AppStateContext';

import { useAgentStatus } from '@/contexts/AgentStatusContext';

export default function TaskInProgress() {
  const appValues = useAppState();
  const agentValues = useAgentStatus();
  
  const { data, getData, fetching } = useApiGet();
  const [reload, setReload] = useState(1);

  const [records, setRecords] = useState<Array<any>>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 860 has been called`, `color: green; font-weight: bold;`)
    if (agentValues.isAgentAvailable) getData({url:'/v1/stats/in-progress', target:'agent'});
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 870 has been called`, `color: green; font-weight: bold;`)
    if (data !== undefined) {
      
      const data_sorted = sortBy(data?.payload, sortStatus.columnAccessor);
      const data_order = sortStatus.direction === 'desc' ? data_sorted.reverse() : data_sorted;
      setRecords(data_order);
    } else {
      setRecords([]);
    }
  }, [data, sortStatus]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 880 has been called`, `color: green; font-weight: bold;`)
    const data_sorted = sortBy(records, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === 'desc' ? records.reverse() : data_sorted);
  }, [sortStatus]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 890 has been called`, `color: green; font-weight: bold;`)
    const interval = setInterval(() => {
      if (agentValues.isAgentAvailable) getData({url:'/v1/stats/in-progress', addInHistory:false, target:'agent'});
    }, appValues.refreshRecent);
    return () => clearInterval(interval);
  }, [agentValues.currentAgent, agentValues.isAgentAvailable]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="left" wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind.toLowerCase()} record={record} />
      <LogsActionIcon resourceType={record.kind.toLowerCase()} record={record} />
      {record.kind.toLowerCase() === 'backup' && (
        <DeleteActionIcon
          resourceType="backup"
          record={record}
          reload={reload}
          setReload={setReload}
        />
      )}
    </Group>
  );

  return (
    <>
      <Accordion.Item key="RecentTask" value="RecentTask">
        <Accordion.Control icon={<IconClock />}>
          <Group justify="space-between">
            <Text>Task in progress</Text>
            <Tooltip label="Click to refresh">
              <IconReload
                style={{ width: rem(20), height: rem(20) }}
                stroke={2}
                color={
                  fetching
                    ? 'var(--mantine-color-green-filled)'
                    : 'var(--mantine-color-blue-filled)'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setReload(reload + 1);
                }}
                size={30}
                aria-label="ActionIcon with size as a number"
              />
            </Tooltip>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <DataTable
            height={240}
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            idAccessor="id"
            records={records}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            pinLastColumn
            columns={[
              {
                accessor: 'id',
                title: 'Nr',
                sortable: true,
                width: 50,
              },
              {
                accessor: 'kind',
                title: 'Kind',
                width: 100,
                ellipsis: true
              },
              {
                accessor: 'metadata.name',
                title: 'Name',
                sortable: true,
                width: 400,
                ellipsis: true
              },
              {
                accessor: 'metadata.labels["velero.io/schedule-name"]',
                title: 'Schedule name',
                render: ({ metadata }: any) => {
                  if (
                    metadata.labels !== undefined &&
                    'velero.io/schedule-name' in metadata.labels
                  ) {
                    return <>{metadata.labels['velero.io/schedule-name']}</>;
                  }
                  return <></>;
                },
                sortable: true,
                width: 250,
                ellipsis: true
              },
              { accessor: 'status.phase', title: 'Status', sortable: true, width: 100,
              ellipsis: true },
              { accessor: 'status.errors', title: 'Errors', sortable: true ,width: 100,
              ellipsis: true},
              { accessor: 'status.warnings', title: 'Warnings', sortable: true,width: 100,
              ellipsis: true },
              { accessor: 'status.startTimestamp', title: 'Start', sortable: true, width: 200,
              ellipsis: true },
              { accessor: 'status.completionTimestamp', title: 'Completion', sortable: true, width: 200,
              ellipsis: true },
              { accessor: 'status.expiration', title: 'Expires', sortable: true,width: 200,
              ellipsis: true },
              {
                accessor: 'status.expire_in',
                title: 'Expires in',
                sortable: true,
                render: ({ status }) => (
                  <>
                    <ExpireIn expiration={status.expiration} />
                  </>
                ),
                width: 200,
              ellipsis: true
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
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
