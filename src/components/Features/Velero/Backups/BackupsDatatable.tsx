'use client';

import { useEffect, useState } from 'react';

import { DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';
import { useDebouncedValue } from '@mantine/hooks';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';

import LastBackupsFilter from '@/components/Features/Velero/Backups/Actions/LastBackupsFilter';
import CreateBackupAction from '@/components/Features/Velero/Backups/Actions/CreateBackupAction';

import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { useBackups } from '@/api/Backup/useBackups';

import { BackupDataTableView } from '@/components/Features/Velero/Backups/BackupsDataTableView';
import { MainStack } from '@/components/Commons/MainStack';

const PAGE_SIZES = [10, 15, 20];

interface BackupDataProps {
  scheduleName?: string; // The property is optional
}

export function BackupsDatatable({ scheduleName }: BackupDataProps) {
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

  // filter
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);
  const [queryName, setQueryName] = useState('');
  const [debouncedQuery] = useDebouncedValue(queryName, 200);

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
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    // filter
    const data_filter = data_sorted.filter(({ metadata, status }: any) => {
      if (
        debouncedQuery !== '' &&
        !metadata?.name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
      ) {
        return false;
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
  }, [page, pageSize, sortStatus, selectedSchedule, selectedPhase, items, debouncedQuery]);

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
        <LastBackupsFilter
          setOnlyLast4Schedule={setOnlyLast4Schedule}
        />
        <CreateBackupAction setReload={setReload} reload={reload} />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />

      <BackupDataTableView
        records={records}
        dataFiltered={dataFiltered}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        sortStatus={sortStatus}
        setSortStatus={setSortStatus}
        fetching={fetching}
        setReload={setReload}
        data={data}
        items={items}
        setSelectedSchedule={setSelectedSchedule}
        selectedSchedule={selectedSchedule}
        setSelectedPhase={setSelectedPhase}
        selectedPhase={selectedPhase}
        queryName={queryName}
        setQueryName={setQueryName}
      />
    </MainStack>
  );
}
