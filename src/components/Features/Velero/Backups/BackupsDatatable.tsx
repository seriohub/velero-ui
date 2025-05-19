'use client';

import { useEffect, useState } from 'react';

import { DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';
import { useDebouncedValue } from '@mantine/hooks';
import { debounce } from 'lodash';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';

import LastBackupsFilter from '@/components/Features/Velero/Backups/Actions/LastBackupsFilter';
import CreateBackupAction from '@/components/Features/Velero/Backups/Actions/CreateBackupAction';

import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { useBackups } from '@/api/Backup/useBackups';

import { MainStack } from '@/components/Commons/MainStack';
import { BackupDatatableView } from '@/components/Features/Velero/Backups/BackupsDatatableView';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

interface BackupDataProps {
  scheduleName?: string; // The property is optional
}

export function BackupsDatatable({ scheduleName }: BackupDataProps) {
  const {
    data,
    getBackups,
    fetchedTime,
    fetching
  } = useBackups();
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

  // useWatchResources('backups');
  /* watch */
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'deletebackuprequests') {
      setReload((prev) => prev + 1);
    }
  }, 250);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

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
    const data_filter = data_sorted.filter(({
                                              metadata,
                                              status
                                            }: any) => {
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
        breadcrumbItem={scheduleName ? [{ 'name': scheduleName }, { 'name': 'Backups' }] : [{ name: 'Backups' }]}
      >
        <LastBackupsFilter setOnlyLast4Schedule={setOnlyLast4Schedule}/>
        <CreateBackupAction/>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>
      <DataFetchedInfo fetchedTime={fetchedTime}/>

      <BackupDatatableView
        records={records}
        dataFiltered={dataFiltered}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        sortStatus={sortStatus}
        setSortStatus={setSortStatus}
        fetching={fetching && items?.length === 0}
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
