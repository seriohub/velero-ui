'use client';

import { useEffect, useState } from 'react';

import { DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import CreateBackupToolbarIcon from '../../Actions/ToolbarActionIcons/CreateBackupToolbarIcon';
import Toolbar from '../../Toolbar';

import LastBackup4Schedule from '../../Actions/ToolbarActionIcons/LastBackup4Schedule';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useBackups } from '@/api/Backup/useBackups';

import { BackupDataTable } from '@/components/Velero/Backups/DataTable';
import { MainStack } from '@/components/Velero/MainStack';

const PAGE_SIZES = [10, 15, 20];

interface BackupDataProps {
  scheduleName?: string; // The property is optional
}

export function BackupData({ scheduleName }: BackupDataProps) {
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

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) {
      getBackups({
        scheduleName,
        onlyLast4Schedule,
        forced: true,
      });
    }
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getBackups({
        scheduleName,
        onlyLast4Schedule,
        forced: false,
      });
    }
  }, [onlyLast4Schedule, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data.payload);
    } else {
      setItems([]);
    }
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

      return !(selectedPhase.length !== 0 && !selectedPhase.includes(status.phase));
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
  }, [selectedSchedule, sortStatus, onlyLast4Schedule]);

  return (
    <MainStack>
      <Toolbar
        title="Backup"
        breadcrumbItem={[
          {
            name: 'Backups',
          },
        ]}
      >
        <LastBackup4Schedule
          setReload={setReload}
          reload={reload}
          setOnlyLast4Schedule={setOnlyLast4Schedule}
        />
        <CreateBackupToolbarIcon setReload={setReload} reload={reload} />
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />

      <BackupDataTable
        records={records}
        dataFiltered={dataFiltered}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        sortStatus={sortStatus}
        setSortStatus={setSortStatus}
        fetching={fetching}
        reload={reload}
        setReload={setReload}
        data={data}
        items={items}
        setSelectedSchedule={setSelectedSchedule}
        selectedSchedule={selectedSchedule}
        setSelectedPhase={setSelectedPhase}
        selectedPhase={selectedPhase}
      />
    </MainStack>
  );
}
