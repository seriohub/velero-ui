import { useMemo } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Anchor, Center, Group, MultiSelect, Text, Tooltip } from '@mantine/core';

import {
  IconClick,
  IconClock,
  IconDeviceFloppy,
  IconSearch,
  IconServer,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { getExpirationString } from '@/utils/GetExpirationString';
import { getDurationDetails } from '@/utils/GetDurationDetails';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import LogsActionIcon from '@/components/Features/Velero/Commons/Actions/LogsActionIcon';
import DeleteActionIcon from '@/components/Features/Velero/Commons/Actions/DeleteActionIcon';

import RestoreActionIcon from '@/components/Features/Velero/Backups/Actions/RestoreActionIcon';
import UpdateExpirationActionIcon from '@/components/Features/Velero/Backups/Actions/UpdateExpirationActionIcon';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';

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

export function BackupDataTableView({
  records,
  dataFiltered,
  pageSize,
  page,
  setPage,
  setPageSize,
  sortStatus,
  setSortStatus,
  fetching,
  reload,
  setReload,
  data,
  items,
  selectedSchedule,
  setSelectedSchedule,
  setSelectedPhase,
  selectedPhase,
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
    const schedule_list = Array.from(
      new Set<string>(
        items
          .map((e: any) => e.status.phase)
          .filter((scheduleName: any) => scheduleName !== undefined)
      )
    );
    return [...schedule_list];
  }, [data]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record} />
      <LogsActionIcon resourceType="backup" record={record} />
      <UpdateExpirationActionIcon record={record} />
      <RestoreActionIcon record={record} reload={reload} setReload={setReload} />
      <DeleteActionIcon
        resourceType="backup"
        record={record}
        reload={reload}
        setReload={setReload}
      />
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
          //width: 160,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined} />
          ),
        },
        {
          accessor: 'status.errors',
          title: 'Errors',
          sortable: true,
          //width: 160,
          ellipsis: true,
        },
        {
          accessor: 'status.warnings',
          title: 'Warnings',
          sortable: true,
          //width: 160,
          ellipsis: true,
        },
        {
          accessor: 'metadata.creationTimestamp',
          title: 'Created',
          sortable: true,
          //width: 200,
          ellipsis: true,
        },
        {
          accessor: 'Duration',
          title: 'Duration',
          render: ({ status }: any) => <>{get_duration(status)}</>,
          //width: 200,
          ellipsis: true,
        },
        {
          accessor: 'status.expiration',
          title: 'Expires in',
          sortable: true,
          render: ({ status }: any) => (
            <>
              <Tooltip label={status?.expiration} offset={5}>
                <Text size="sm">{getExpirationString(data?.status?.expiration)}</Text>
              </Tooltip>
            </>
          ),
          //width: 200,
          ellipsis: true,
        },
        {
          accessor: 'metadata.labels["velero.io/storage-location"]',

          title: 'Storage Location',
          sortable: true,
          //width: 250,
          ellipsis: true,
          render: ({ metadata }: any) => (
            <>
              <Anchor
                size="sm"
                onClick={() => {
                  // console.log(record);
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
