import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import {
  Anchor,
  Card,
  Center,
  Group,
  ScrollArea,
  Text,
  Title,
  useComputedColorScheme,
} from '@mantine/core';

import sortBy from 'lodash/sortBy';
import { IconClick, IconClock } from '@tabler/icons-react';

import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';

const PAGE_SIZES = [10, 15, 20];

interface BackupLatestProps {
  latest: Array<any>;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export function LatestBackup({ setReload, latest = [] }: BackupLatestProps) {
  const router = useRouter();
  const [items, setItems] = useState<Array<any>>(latest);
  const isMobile = useMediaQuery('(max-width: 36em)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, 5));

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
      {/*<LogsActionIcon resourceType="backup" record={record} />*/}
      <RestoreAction record={record} setReload={setReload} />
      <DeleteAction resourceType="backup" record={record} setReload={setReload} />
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
          computedColorScheme === 'light'
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
            //withColumnBorders
            striped
            highlightOnHover
            records={records}
            idAccessor="metadata.name"
            // totalRecords={records.length}
            // recordsPerPage={pageSize}
            // page={page}
            // onPageChange={(p) => setPage(p)}
            // recordsPerPageOptions={PAGE_SIZES}
            // onRecordsPerPageChange={setPageSize}
            // sortStatus={sortStatus}
            // onSortStatusChange={setSortStatus}
            // pinLastColumn
            /*bg={
              computedColorScheme === 'light'
                ? 'var(--mantine-color-white)'
                : 'var(--mantine-color-dark-6)'
            }*/
            style={
              computedColorScheme === 'light'
                ? { backgroundColor: 'var(--mantine-color-white)' }
                : { backgroundColor: 'var(--mantine-color-dark-6)' }
            }
            columns={[
              {
                accessor: 'metadata.name',
                title: 'Name',
                sortable: true,
                render: (record) => (
                  <Anchor
                    size="sm"
                    onClick={() => {
                      // console.log(record);
                      router.push(`/backups/${record?.metadata?.name}`);
                    }}
                  >
                    {record?.metadata?.name}
                  </Anchor>
                ),
              },
              {
                accessor: 'metadata.labels["velero.io/schedule-name"]',
                title: 'Schedule',
                sortable: true,
                render: ({ metadata }: any) => (
                  <>
                    {metadata.labels && metadata.labels['velero.io/schedule-name'] && (
                      <Anchor
                        size="sm"
                        onClick={() => {
                          router.push(`/schedules/${metadata.labels['velero.io/schedule-name']}`);
                        }}
                      >
                        <Group gap={5}>
                          <IconClock size={16} />
                          <Text>{metadata.labels['velero.io/schedule-name']}</Text>
                        </Group>
                      </Anchor>
                    )}
                  </>
                ),
              },
              {
                accessor: 'status.phase',
                title: 'Status',
                sortable: true,
                render: ({ status }: any) => (
                  <VeleroResourceStatusBadge status={status?.phase || undefined} />
                ),
              },
              {
                accessor: 'status.errors',
                title: 'Errors',
                sortable: true,
              },
              {
                accessor: 'status.warnings',
                title: 'Warnings',
                sortable: true,
              },
              {
                accessor: 'metadata.creationTimestamp',
                title: 'Created',
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
        </ScrollArea>
      </Card>
    </>
  );
}
