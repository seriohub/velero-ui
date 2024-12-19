'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import {
  Badge,
  Card,
  Center,
  Group,
  ScrollArea,
  Stack,
  Stepper,
  Title,
  useComputedColorScheme,
} from '@mantine/core';

import sortBy from 'lodash/sortBy';
import { IconClick } from '@tabler/icons-react';

import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import RestoreActionIcon from '@/components/Actions/DatatableActionsIcons/RestoreActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';

import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';
import BackupsStepperDescription from './BackupsStepperDescription';
import { useMediaQuery } from '@mantine/hooks';

const PAGE_SIZES = [10, 15, 20];

interface BackupLatestProps {
  latest: Array<any>;
  reload: number;
  setReload: any;
}

export function BackupLatest({ reload, setReload, latest = [] }: BackupLatestProps) {
  const [items, setItems] = useState<Array<any>>(latest);
  const isMobile = useMediaQuery(`(max-width: 36em)`);
  const isTablet = useMediaQuery(`(max-width: 1024px)`);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, 5));

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 400 has been called`, `color: green; font-weight: bold;`);
    setItems(latest);
  }, [latest]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 410 has been called`, `color: green; font-weight: bold;`);
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
      <Card
        withBorder
        p="md"
        radius="md"
        shadow="sm"
        h={310}
        bg={
          computedColorScheme == 'light'
            ? 'var(--mantine-color-white)'
            : 'var(--mantine-color-dark-6)'
        }
      >
        <Title order={5} mb={20}>
          Recent Backups
        </Title>

        <ScrollArea
          w={
            isMobile
              ? 'calc(100vw - 70px)'
              : isTablet
                ? 'calc(100vw - 70px - var(--app-shell-navbar-width))'
                : ''
          }
        >
          <DataTable
            minHeight={160}
            // style={{ width: "calc(100% - 500px)" }}

            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            records={records}
            idAccessor="id"
            // totalRecords={records.length}
            // recordsPerPage={pageSize}
            // page={page}
            // onPageChange={(p) => setPage(p)}
            // recordsPerPageOptions={PAGE_SIZES}
            // onRecordsPerPageChange={setPageSize}
            // sortStatus={sortStatus}
            // onSortStatusChange={setSortStatus}
            // pinLastColumn
            bg={
              computedColorScheme == 'light'
                ? 'var(--mantine-color-white)'
                : 'var(--mantine-color-dark-6)'
            }
            style={
              computedColorScheme == 'light'
                ? { backgroundColor: 'var(--mantine-color-white)' }
                : { backgroundColor: 'var(--mantine-color-dark-6)' }
            }
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
                render: ({ status }: any) => <>{<VeleroResourceStatusBadge status={status.phase} />}</>,
              },
              { accessor: 'status.errors', title: 'Errors', sortable: true },
              { accessor: 'status.warnings', title: 'Warnings', sortable: true },
              { accessor: 'metadata.creationTimestamp', title: 'Created', sortable: true },

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
        </ScrollArea>
      </Card>
    </>
  );
}
