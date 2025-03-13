'use client';

import { useMemo } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  ActionIcon,
  Anchor,
  Center,
  Group,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';

import {
  IconClick,
  IconClock,
  IconDeviceFloppy,
  IconSearch,
  IconServer,
  IconX,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { getExpirationString } from '@/utils/getExpirationString';
import { getDurationDetails } from '@/utils/getDurationDetails';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import UpdateExpirationAction from '@/components/Features/Velero/Backups/Actions/UpdateExpirationAction';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import { formatDateTime } from '@/utils/formatDateTime';
import DownloadAction from '@/components/Features/Velero/Backups/Actions/DownloadAction';
import InspectAction from '@/components/Features/Velero/Backups/Actions/InspectAction';

const PAGE_SIZES = [10, 15, 20];

function get_duration(status: any) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const { formattedDuration, duration } = getDurationDetails(startTimestamp, completionTimestamp);
    return (
      <Tooltip label={duration} offset={5}>
        <Text size="sm">{formattedDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function BackupDatatableView({
  records,
  dataFiltered,
  pageSize,
  page,
  setPage,
  setPageSize,
  sortStatus,
  setSortStatus,
  fetching,
  setReload,
  data,
  items,
  selectedSchedule,
  setSelectedSchedule,
  setSelectedPhase,
  selectedPhase,
  queryName,
  setQueryName,
}: any) {
  const router = useRouter();
  const pathname = usePathname();

  // get schedule name list
  const schedule = useMemo(() => {
    const schedule_list = Array.from(
      new Set<string>(
        items
          .map((e: any) =>
            e.metadata.labels && e.metadata.labels['velero.io/schedule-name'] !== undefined
              ? e.metadata.labels['velero.io/schedule-name']
              : undefined
          )
          .filter((scheduleName: any) => scheduleName !== undefined)
      )
    );
    return [...schedule_list];
  }, [items]);

  // get schedule status list
  const phase = useMemo(() => {
    const schedule_list = Array.from(new Set<string>(items.map((e: any) => e?.status?.phase)));
    return [...schedule_list];
  }, [items]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="center" wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record} />
      <UpdateExpirationAction record={record} setReload={setReload} />
      <DownloadAction record={record} />
      <InspectAction record={record} />
      <RestoreAction record={record} setReload={setReload} />
      <DeleteAction resourceType="backup" record={record} setReload={setReload} />
    </Group>
  );

  return (
    <DataTable
      minHeight={160}
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      records={records}
      idAccessor="metadata.name"
      totalRecords={dataFiltered.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={fetching}
      pinLastColumn
      columns={[
        {
          accessor: 'metadata.name',
          title: 'Name',
          sortable: true,
          //width: 400,
          ellipsis: true,
          filter: (
            <TextInput
              label="backups"
              description="Show backups whose names include the specified text"
              placeholder="Search backups..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  c="dimmed"
                  onClick={() => setQueryName('')}
                >
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryName}
              onChange={(e) => setQueryName(e.currentTarget.value)}
            />
          ),
          filtering: queryName !== '',
          render: (record) => (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backups/${record?.metadata?.name}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16} />
                <Text>{record?.metadata?.name}</Text>
              </Group>
            </Anchor>
          ),
        },
        {
          accessor: 'metadata.labels["velero.io/schedule-name"]',
          ellipsis: true,
          title: 'Schedule',
          sortable: true,
          filter: (
            <MultiSelect
              label="Schedule"
              description="Show backups of the selected schedule"
              data={schedule}
              value={selectedSchedule}
              placeholder="Search schedule…"
              onChange={setSelectedSchedule}
              leftSection={<IconSearch size={16} />}
              clearable
              searchable
            />
          ),
          filtering: selectedSchedule.length > 0,
          render: ({ metadata }: any) => (
            <>
              {metadata.labels &&
                metadata.labels['velero.io/schedule-name'] &&
                pathname !== `/schedules/${metadata.labels['velero.io/schedule-name']}` && (
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
              {metadata.labels &&
                metadata.labels['velero.io/schedule-name'] &&
                pathname === `/schedules/${metadata.labels['velero.io/schedule-name']}` && (
                  <Text size="sm">{metadata.labels['velero.io/schedule-name']}</Text>
                )}
            </>
          ),
        },
        {
          accessor: 'status.phase',
          title: 'Status',
          sortable: true,
          filter: (
            <MultiSelect
              label="Phase"
              description="Show all backups of the selected schedule"
              data={phase}
              value={selectedPhase}
              placeholder="Search schedule…"
              onChange={setSelectedPhase}
              leftSection={<IconSearch size={16} />}
              clearable
              searchable
            />
          ),
          filtering: selectedPhase.length > 0,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined} />
          ),
        },
        {
          accessor: 'status.errors',
          title: 'Errors',
          sortable: true,
          ellipsis: true,
        },
        {
          accessor: 'status.warnings',
          title: 'Warnings',
          sortable: true,
          ellipsis: true,
        },
        {
          accessor: 'metadata.creationTimestamp',
          title: 'Created',
          sortable: true,
          ellipsis: true,
          render: ({ metadata }: any) => <>{formatDateTime(metadata.creationTimestamp)}</>,
        },
        {
          accessor: 'Duration',
          title: 'Duration',
          render: ({ status }: any) => <>{get_duration(status)}</>,
          ellipsis: true,
        },
        {
          accessor: 'status.expiration',
          title: 'Expires in',
          sortable: true,
          render: ({ status }: any) => (
            <>
              <Tooltip label={status?.expiration} offset={5}>
                <Text size="sm">{getExpirationString(status?.expiration)}</Text>
              </Tooltip>
            </>
          ),
          ellipsis: true,
        },
        {
          accessor: 'metadata.labels["velero.io/storage-location"]',

          title: 'Storage Location',
          sortable: true,
          ellipsis: true,
          render: ({ metadata }: any) => (
            <>
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(
                    `/backup-storage-locations/${metadata.labels && metadata.labels['velero.io/storage-location']}`
                  );
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  <Text>{metadata.labels && metadata.labels['velero.io/storage-location']}</Text>
                </Group>
              </Anchor>
            </>
          ),
        },
        {
          accessor: 'actions',
          title: (
            <Center>
              <IconClick size={16} />
            </Center>
          ),
          //width: '0%',
          render: renderActions,
        },
      ]}
    />
  );
}
