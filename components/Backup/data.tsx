'use client';

import { useEffect, useMemo, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Center, Group, MultiSelect, Stack } from '@mantine/core';

import sortBy from 'lodash/sortBy';
import { IconClick, IconSearch } from '@tabler/icons-react';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import RestoreActionIcon from '@/components/Actions/DatatableActionsIcons/RestoreActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import CreateBackupToolbarIcon from '../Actions/ToolbarActionIcons/CreateBackupToolbarIcon';
import Toolbar from '../Toolbar';

const PAGE_SIZES = [10, 15, 20];

interface BackupDataProps {
  limit: number;
}

export function BackupData({ limit = -1 }: BackupDataProps) {
  const { data, getData, error, fetching } = useApiWithGet();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [dataFiltered, setDataFilter] = useState<any[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);

  const [records, setRecords] = useState(items.slice(0, pageSize));

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

  useEffect(() => {
    getData('/api/v1/backup/get');
  }, [reload]);

  useEffect(() => {
    getData('/api/v1/backup/get');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      if (limit === -1) {
        setItems(data.payload.items);
      } else {
        setItems(data.payload.items.slice(0, limit));
      }
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    const data_filter = data_sorted.filter(({ metadata, status }: any) => {
      if (selectedSchedule.length === 0 && selectedPhase.length === 0) {
        return true;
      }

      if (
        selectedSchedule.length !== 0 && metadata.labels !== undefined &&
        !selectedSchedule.includes(metadata.labels['velero.io/schedule-name'])
      ) {
        return false;
      }
      if (selectedPhase.length !== 0 && !selectedPhase.includes(status.phase)) {
        return false;
      }

      return true;
    });
    setDataFilter(data_filter);
    setRecords(
      sortStatus.direction === 'desc'
        ? data_filter.reverse().slice(from, to)
        : data_filter.slice(from, to)
    );
  }, [page, pageSize, sortStatus, selectedSchedule, selectedPhase, data]);

  useEffect(() => {
    setPage(1);
  }, [selectedSchedule]);

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
        <Toolbar title="Backup">
          <CreateBackupToolbarIcon setReload={setReload} reload={reload} />
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>

        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={records}
          idAccessor="id"
          totalRecords={dataFiltered.length}
          paginationActiveBackgroundColor="grape"
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
              filter: (
                <MultiSelect
                  label="Schedule name"
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
