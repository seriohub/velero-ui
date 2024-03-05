'use client';

import { useEffect, useMemo, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { Center, Group, MultiSelect, Stack } from '@mantine/core';
import { IconClick, IconSearch } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';
import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import LogsActionIcon from '@/components/Actions/DatatableActionsIcons/LogsActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../Toolbar';

const PAGE_SIZES = [10, 15, 20];

export function RestoreData() {
  const { data, getData, fetching } = useApiGet();
  const [items, setItems] = useState([]);
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
          .map((e: any) => e.spec.scheduleName)
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
    getData('/api/v1/restore/get');
  }, [reload]);

  useEffect(() => {
    getData('/api/v1/restore/get');
  }, []);

  useEffect(() => {
    if (data !== undefined) setItems(data.payload);
    else setItems([]);
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
    setPage(1);
  }, [selectedSchedule]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="restore" record={record} />
      <LogsActionIcon resourceType="restore" record={record} />
      <DeleteActionIcon
        resourceType="restore"
        record={record}
        reload={reload}
        setReload={setReload}
      />
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0}>
        <Toolbar title="Restore">
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
          totalRecords={dataFiltered.length}
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
              accessor: 'spec.backupName',
              title: 'Backup name',
              sortable: true,
            },
            {
              accessor: 'spec.scheduleName',
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
            { accessor: 'status.startTimestamp', title: 'Started', sortable: true },
            { accessor: 'status.completionTimestamp', title: 'Completed', sortable: true },
            { accessor: 'status.errors', title: 'Errors', sortable: true },
            { accessor: 'status.warnings', title: 'Warnings', sortable: true },
            { accessor: 'metadata.creationTimestamp', title: 'Created', sortable: true },
            { accessor: 'status.progress.totalItems', title: 'Total items' },
            { accessor: 'status.progress.itemsRestored', title: 'Items restored' },
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
