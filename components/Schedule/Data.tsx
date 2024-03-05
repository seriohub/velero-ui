'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { Center, Group, Stack } from '@mantine/core';
import { IconClick } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';
import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import StartStopActionIcon from '../Actions/DatatableActionsIcons/StartStopActionIcon';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import CreateBackupFromScheduleActionIcon from '../Actions/DatatableActionsIcons/CreateBackupFromScheduleActionIcon';
import CreateSecheduleToolbarIcon from '../Actions/ToolbarActionIcons/CreateScheduleToolbarIcon';
import EditScheduleActionIcon from '../Actions/DatatableActionsIcons/EditScheduleActionIcon';
import Toolbar from '../Toolbar';

const PAGE_SIZES = [10, 15, 20];

export function ScheduleData() {
  const { data, getData, fetching } = useApiGet();
  const [items = [], setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    getData('/api/v1/schedule/get');
  }, [reload]);

  useEffect(() => {
    getData('/api/v1/schedule/get');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus, items]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="schedule" record={record} />
      <CreateBackupFromScheduleActionIcon record={record} />
      <StartStopActionIcon
        resourceName={record.metadata.name}
        paused={record.spec.paused === true}
        reload={reload}
        setReload={setReload}
      />
      <EditScheduleActionIcon record={record} reload={reload} setReload={setReload} />
      <DeleteActionIcon
        resourceType="schedule"
        record={record}
        reload={reload}
        setReload={setReload}
      />
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0}>
        <Toolbar title="Schedule">
          <CreateSecheduleToolbarIcon setReload={setReload} reload={reload} />
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>

        <DataTable
          minHeight={160}
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={records}
          idAccessor="id"
          totalRecords={items.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          fetching={fetching}
          columns={[
            {
              accessor: 'id',
              title: 'Number',
              sortable: true,
              width: 105,
            },
            {
              accessor: 'metadata.name',
              title: 'Name',
              sortable: true,
            },
            { accessor: 'metadata.creationTimestamp', title: 'Created', sortable: true },
            { accessor: 'spec.schedule', title: 'Schedule' },
            { accessor: 'spec.template.ttl', title: 'Backup TTL' },
            {
              accessor: '.spec.template.defaultVolumesToFsBackup',
              title: 'defaultVolumesToFsBackup',
              render: (record) => {
                if (record.spec.template.defaultVolumesToFsBackup === true) {
                  return <>true</>;
                }
                return <>false</>;
              },
            },
            { accessor: 'status.lastBackup', title: 'Last Backup', sortable: true },
            {
              accessor: 'status',
              title: 'Paused',
              sortable: true,
              render: (record) => {
                if (record.spec.paused === true) {
                  return <>true</>;
                }
                return <>false</>;
              },
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
      </Stack>
    </>
  );
}
