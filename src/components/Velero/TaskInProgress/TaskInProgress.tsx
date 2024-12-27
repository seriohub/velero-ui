'use client';

import { useContext, useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import { Group, Center, Accordion, Text, rem, Tooltip, ActionIcon, Box } from '@mantine/core';

import { IconClick, IconClock, IconRefresh, IconReload } from '@tabler/icons-react';

import sortBy from 'lodash/sortBy';

import { useAppStatus } from '@/contexts/AppContext';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useStatsInProgress } from '@/api/Stats/useStatsInProgress';
import ExpireIn from '../Backup/ExpireIn';
import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

export default function TaskInProgress() {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();

  const { data, getStatsInProgress, fetching } = useStatsInProgress();
  const [reload, setReload] = useState(1);

  const [records, setRecords] = useState<Array<any>>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      // if (process.env.NODE_ENV === 'development')
      //  console.log(`%cuseEffect 860 has been called`, `color: green; font-weight: bold;`);
      getStatsInProgress();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined) {
      // if (process.env.NODE_ENV === 'development')
      //  console.log(`%cuseEffect 870 has been called`, `color: green; font-weight: bold;`);

      const data_sorted = sortBy(data?.payload, sortStatus.columnAccessor);
      const data_order = sortStatus.direction === 'desc' ? data_sorted.reverse() : data_sorted;
      setRecords(data_order);
    } else {
      setRecords([]);
    }
  }, [data, sortStatus]);

  useEffect(() => {
    if (records.length > 0) {
      // if (process.env.NODE_ENV === 'development')
      //  console.log(`%cuseEffect 880 has been called`, `color: green; font-weight: bold;`);
      const data_sorted = sortBy(records, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === 'desc' ? records.reverse() : data_sorted);
    }
  }, [sortStatus]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 890 has been called`, `color: green; font-weight: bold;`);
    const interval = setInterval(() => {
      if (agentValues.isAgentAvailable) getStatsInProgress();
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
      <Accordion.Item key="TaskInProgress" value="TaskInProgress">
        <Accordion.Control>
          <Group justify="space-between">
            <Text>{records.length > 0 ? `[${records.length}]` : ''} Task in progress</Text>

            <Box>
              {/*<IconReload
                style={{ width: rem(20), height: rem(20) }}
                stroke={2}
                color={
                  fetching
                    ? 'var(--mantine-primary-color-filled)'
                    : 'var(--mantine-primary-color-light-color)'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setReload(reload + 1);
                }}
                size={30}
                aria-label="ActionIcon with size as a number"
              />*/}
              <ActionIcon
                component="div"
                onClick={(e) => {
                  e.stopPropagation();
                  setReload(reload + 1);
                }}
                size={30}
                //variant="default"
                variant="transparent"
                radius={8}
                disabled={fetching}
                color={
                  fetching
                    ? 'var(--mantine-primary-color-filled)'
                    : 'var(--mantine-primary-color-light-color)'
                }
              >
                <Tooltip label="Click to refresh">
                  <IconReload stroke={2} />
                </Tooltip>
              </ActionIcon>
            </Box>
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
                ellipsis: true,
              },
              {
                accessor: 'metadata.name',
                title: 'Name',
                sortable: true,
                width: 400,
                ellipsis: true,
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
                ellipsis: true,
              },
              {
                accessor: 'status.phase',
                title: 'Status',
                sortable: true,
                width: 100,
                ellipsis: true,
                render: ({ status }: any) => (
                  <>{<VeleroResourceStatusBadge status={status.phase} />}</>
                ),
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
                width: 200,
                ellipsis: true,
              },
              {
                accessor: 'status.completionTimestamp',
                title: 'Completion',
                sortable: true,
                width: 200,
                ellipsis: true,
              },
              {
                accessor: 'status.expiration',
                title: 'Expires',
                sortable: true,
                width: 200,
                ellipsis: true,
              },
              {
                accessor: 'status.expire_in',
                title: 'Expires in',
                sortable: true,
                render: ({ status }: any) => (
                  <>
                    <ExpireIn expiration={status.expiration} />
                  </>
                ),
                width: 200,
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
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
