'use client';

import { useEffect, useMemo, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Center, Group, MultiSelect, Stack } from '@mantine/core';

import sortBy from 'lodash/sortBy';
import { IconClick, IconSearch } from '@tabler/icons-react';

import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import RestoreActionIcon from '@/components/Actions/DatatableActionsIcons/RestoreActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import CreateBackupToolbarIcon from '../../Actions/ToolbarActionIcons/CreateBackupToolbarIcon';
import Toolbar from '../../Toolbar';
import UpdateExpirationActionIcon from '../../Actions/DatatableActionsIcons/UpdateExpirationActionIcon';
import ExpireIn from './ExpireIn';
import Duration from './Duration';
import LastBackup4Schedule from '../../Actions/ToolbarActionIcons/LastBackup4Schedule';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useBackups } from '@/api/Backup/useBackups';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

const PAGE_SIZES = [10, 15, 20];

interface BackupDataProps {
  limit: number;
}

export function BackupData({ limit = -1 }: BackupDataProps) {
  const { data, getBackups, fetching } = useBackups();
  const [items, setItems] = useState<Record<string, any>>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [onlyLast4Schedule, setOnlyLast4Schedule] = useState(false);

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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 360 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload > 1) getBackups(onlyLast4Schedule, true);
  }, [reload]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 360 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) getBackups(onlyLast4Schedule, false);
  }, [onlyLast4Schedule, agentValues.isAgentAvailable]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 370 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      if (limit === -1) {
        setItems(data.payload);
      } else {
        setItems(data.payload.slice(0, limit));
      }
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 380 has been called`, `color: green; font-weight: bold;`);
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    const data_filter = data_sorted.filter(({ metadata, status }: any) => {
      if (selectedSchedule.length === 0 && selectedPhase.length === 0) {
        return true;
      }

      if (
        selectedSchedule.length !== 0 &&
        metadata.labels !== undefined &&
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
  }, [page, pageSize, sortStatus, selectedSchedule, selectedPhase, items]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 390 has been called`, `color: green; font-weight: bold;`);
    setPage(1);
  }, [selectedSchedule, sortStatus, onlyLast4Schedule]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="backup" record={record} />
      <LogsActionIcon resourceType="backup" record={record} />
      <UpdateExpirationActionIcon record={record} />
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
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Backup" breadcrumbItem={{ name: 'Backups', href: '/backups' }}>
          <LastBackup4Schedule
            setReload={setReload}
            reload={reload}
            setOnlyLast4Schedule={setOnlyLast4Schedule}
          />
          <CreateBackupToolbarIcon setReload={setReload} reload={reload} />
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>
        <DataFetchedInfo metadata={data?.metadata} />
        <DataTable
          minHeight={160}
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={records}
          idAccessor="id"
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
              accessor: 'id',
              title: 'Nr',
              sortable: true,
              width: 50,
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
              width: 300,
              ellipsis: true,
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
              width: 160,
              ellipsis: true,
              render: ({ status }: any) => (
                <>{<VeleroResourceStatusBadge status={status.phase} />}</>
              ),
            },
            {
              accessor: 'status.errors',
              title: 'Errors',
              sortable: true,
              width: 160,
              ellipsis: true,
            },
            {
              accessor: 'status.warnings',
              title: 'Warnings',
              sortable: true,
              width: 160,
              ellipsis: true,
            },
            {
              accessor: 'metadata.creationTimestamp',
              title: 'Created',
              sortable: true,
              width: 200,
              ellipsis: true,
            },
            {
              accessor: 'Duration',
              title: 'Duration',
              // sortable: true,
              render: ({ status }: any) => (
                <>
                  <Duration
                    startTimestamp={status.startTimestamp}
                    completionTimestamp={status.completionTimestamp}
                  />
                </>
              ),
              width: 200,
              ellipsis: true,
            },
            {
              accessor: 'status.expiration',
              title: 'Expires in',
              sortable: true,
              render: ({ status }) => (
                <>
                  <ExpireIn expiration={status.expiration} />
                </>
              ),
              width: 200,
              ellipsis: true,
            },
            {
              accessor: 'metadata.labels["velero.io/storage-location"]',
              render: ({ metadata }) => (
                <>{metadata.labels && metadata.labels['velero.io/storage-location']}</>
              ),
              title: 'Storage Location',
              sortable: true,
              width: 250,
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
      </Stack>
    </>
  );
}
