'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import { Group, Center, Stack } from '@mantine/core';

import { IconClick, IconRotateClockwise } from '@tabler/icons-react';

import sortBy from 'lodash/sortBy';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import DescribeActionIcon from '../Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '../Actions/DatatableActionsIcons/LogsActionIcon';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../Toolbar';

export default function RecentTask() {
  const { data, getData, error, fetching } = useApiWithGet();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  useEffect(() => {
    getData('/api/v1/utils/in-progress');
  }, [reload]);

  useEffect(() => {
    if (data !== undefined) {
      const data_sorted = sortBy(data.payload, sortStatus.columnAccessor);
      const data_order = sortStatus.direction === 'desc' ? data_sorted.reverse() : data_sorted;
      setItems(data_order);
    } else {
      setItems([]);
    }
  }, [data]);

  useEffect(() => {
    const data_sorted = sortBy(items, sortStatus.columnAccessor);
    setItems(sortStatus.direction === 'desc' ? data_sorted.reverse() : data_sorted);
  }, [sortStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      getData('/api/v1/utils/in-progress', '', false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind.toLowerCase()} record={record} />
      <LogsActionIcon resourceType={record.kind.toLowerCase()} record={record} />
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0}>
        <Toolbar title="Recent task">
          <RefreshDatatable setReload={setReload} reload={reload} fetching={fetching} />
        </Toolbar>

        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          idAccessor="id"
          // fetching={fetching}
          records={items}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          // define columns
          columns={[
            {
              accessor: 'id',
              title: 'Number',
              sortable: true,
              width: 105,
            },
            {
              accessor: 'kind',
              title: 'Kind',
            },
            {
              accessor: 'metadata.name',
              title: 'Name',
              sortable: true,
            },
            {
              accessor: 'metadata.labels["velero.io/schedule-name"]',
              title: 'Schedule name',
              render: ({ metadata }: any) => {
                if (metadata.labels !== undefined && 'velero.io/schedule-name' in metadata.labels) {
                  return <>{metadata.labels['velero.io/schedule-name']}</>;
                }
                return <></>;
              },
              sortable: true,
            },
            { accessor: 'status.phase', title: 'Status', sortable: true },
            { accessor: 'status.errors', title: 'Errors', sortable: true },
            { accessor: 'status.warnings', title: 'Warnings', sortable: true },
            { accessor: 'status.startTimestamp', title: 'Start', sortable: true },
            { accessor: 'status.completionTimestamp', title: 'Completion', sortable: true },
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
      </Stack>
    </>
  );
}
