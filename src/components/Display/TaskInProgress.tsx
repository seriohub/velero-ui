'use client';

import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Group, Center, Accordion, Text, Tooltip, ActionIcon, Box } from '@mantine/core';
import { IconClick, IconReload } from '@tabler/icons-react';

import { useAppStatus } from '@/contexts/AppContext';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useStatsInProgress } from '@/api/Stats/useStatsInProgress';

import { getExpirationString } from '@/utils/getExpirationString';

import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import LogsActionIcon from '@/components/Features/Velero/Commons/Actions/LogsActionIcon';

import VeleroResourceStatusBadge from '../Features/Velero/Commons/Display/VeleroResourceStatusBadge';

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
      getStatsInProgress();
    }
  }, [reload, agentValues.isAgentAvailable]);

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
        <DeleteAction
          resourceType="backup"
          record={record}
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
              <ActionIcon
                component="div"
                onClick={(e) => {
                  e.stopPropagation();
                  setReload(reload + 1);
                }}
                size={30}
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
                  <IconReload stroke={1.5} />
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
            // withColumnBorders
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
                title: 'Schedules',
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
                  <VeleroResourceStatusBadge status={status?.phase || undefined} />
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
                render: ({ status }: any) => getExpirationString(status?.expiration),
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
