'use client';

import { useEffect, useState } from 'react';

import { DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';
import { useDebouncedValue } from '@mantine/hooks';
import { debounce } from 'lodash';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';

import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import { MainStack } from '@/components/Commons/MainStack';

import { PVBDatatableView } from '@/components/Features/Velero/PodVolumes/PVBDatatableView';
import { usePodVolumes } from '@/api/PodVolumeBackups/usePodVolumes';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function PVBDatatable({ type }: any) {
  const { data, getPodVolumes, fetching } = usePodVolumes();

  const [items, setItems] = useState<Record<string, any>>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [dataFiltered, setDataFilter] = useState<any[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  // filter
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);
  const [queryName, setQueryName] = useState('');
  const [debouncedQuery] = useDebouncedValue(queryName, 200);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  /* watch */
  useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'podvolumebackups') {
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
      getPodVolumes(type);
    }
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getPodVolumes(type);
    }
  }, [agentValues.isAgentAvailable]);

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
    const data_filter = data_sorted.filter(({ spec, status }: any) => {
      if (
        debouncedQuery !== '' &&
        !spec.tags.backup.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
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
  }, [page, pageSize, sortStatus, selectedPhase, items, debouncedQuery]);

  useEffect(() => {
    setPage(1);
  }, [sortStatus]);

  return (
    <MainStack>
      <Toolbar
        title={type === 'PodVolumeBackup' ? 'Pod Volumes Backup' : 'Pod Volumes Restore'}
        breadcrumbItem={[
          {
            name: type === 'PodVolumeBackup' ? 'Pod Volumes Backup' : 'Pod Volumes Restore',
          },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />

      <PVBDatatableView
        records={records}
        dataFiltered={dataFiltered}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        sortStatus={sortStatus}
        setSortStatus={setSortStatus}
        fetching={fetching && records.length === 0}
        items={items}
        setSelectedPhase={setSelectedPhase}
        selectedPhase={selectedPhase}
        queryName={queryName}
        setQueryName={setQueryName}
      />
    </MainStack>
  );
}
