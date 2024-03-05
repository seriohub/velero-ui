'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Center, Group, Stack } from '@mantine/core';

import sortBy from 'lodash/sortBy';
import { IconClick } from '@tabler/icons-react';

import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import RestoreActionIcon from '@/components/Actions/DatatableActionsIcons/RestoreActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import CreateBackupToolbarIcon from '../Actions/ToolbarActionIcons/CreateBackupToolbarIcon';
import Toolbar from '../Toolbar';

const PAGE_SIZES = [10, 15, 20];

interface BackupLatestProps {
  latest: Array<any>;
  reload: number;
  setReload: any;
}

export function BackupLatest({ reload, setReload, latest = [] }: BackupLatestProps) {
  const [items, setItems] = useState<Array<any>>(latest);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    setItems(latest);
  }, [latest]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record} />
      <LogsActionIcon resourceType="backup" record={record} />
      <RestoreActionIcon
        resourceType="backup"
        record={record}
        reload={reload}
        setReload={setReload}
      />
      <DeleteActionIcon
        resourceType="backup"
        record={record}
        reload={reload}
        setReload={setReload}
      />
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0}>
        <Toolbar title="Recent Backup">
          <CreateBackupToolbarIcon setReload={setReload} reload={reload} />
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
          totalRecords={records.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          columns={[
            {
              accessor: 'metadata.name',
              title: 'Name',
              sortable: true,
            },
            {
              accessor: 'metadata.labels["velero.io/schedule-name"]',
              render: ({ metadata }: any) => (
                <>
                  {metadata.labels && metadata.labels['velero.io/schedule-name']
                    ? metadata.labels['velero.io/schedule-name']
                    : undefined}
                </>
              ),
              title: 'Schedule name',
              sortable: true,
            },
            {
              accessor: 'status.phase',
              title: 'Status',
              sortable: true,
            },
            { accessor: 'status.errors', title: 'Errors', sortable: true },
            { accessor: 'status.warnings', title: 'Warnings', sortable: true },
            { accessor: 'metadata.creationTimestamp', title: 'Created', sortable: true },
            { accessor: 'status.expiration', title: 'Expires', sortable: true },
            {
              accessor: 'metadata.labels["velero.io/storage-location"]',
              render: ({ metadata }) => (
                <>{metadata.labels && metadata.labels['velero.io/storage-location']}</>
              ),
              title: 'Storage Location',
              sortable: true,
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
