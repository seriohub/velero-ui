'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { Anchor, Center, Group, Text } from '@mantine/core';
import { IconClick, IconDeviceFloppy, IconRestore } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';

import { debounce } from 'lodash';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useRestores } from '@/api/Restore/useRestores';

import { MainStack } from '@/components/Commons/MainStack';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function RestoresDatatable() {
  const router = useRouter();

  const {
    data,
    getRestores,
    fetching,
    fetchedTime
  } = useRestores();
  const agentValues = useAgentStatus();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [reload, setReload] = useState(1);

  const [dataFiltered, setDataFilter] = useState<any[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState<Record<string, unknown>[]>(items.slice(0, pageSize));

  // useWatchResources('restores');
  /* watch */
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'restores') {
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
    if (agentValues.isAgentAvailable && reload > 1) getRestores(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getRestores();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data.filter((item) => typeof item === 'object' && item !== null));
    } else {
      setItems([]);
    }
  }, [data]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    setDataFilter(data_sorted);
    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus, items]);

  useEffect(() => {
    setPage(1);
  }, []);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DescribeActionIcon resourceType="restore" record={record}/>
      <DeleteAction resourceType="restore" record={record} setReload={setReload}/>
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Restore" breadcrumbItem={[{ name: 'Restores' }]}>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>
      <DataFetchedInfo fetchedTime={fetchedTime}/>
      <DataTable
        minHeight={160}
        withTableBorder
        striped
        highlightOnHover
        records={records}
        totalRecords={dataFiltered.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={fetching && records?.length === 0}
        idAccessor="metadata.name"
        columns={[
          {
            accessor: 'metadata.name',
            title: 'Name',
            sortable: true,
            render: (record: any) => (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/restores/${record?.metadata?.name}`);
                }}
              >
                <Group gap={5}>
                  <IconRestore size={16}/>
                  <Text>{record?.metadata?.name}</Text>
                </Group>
              </Anchor>
            ),
          },
          {
            accessor: 'spec.backupName',
            title: 'Backups',
            sortable: true,
            render: (record: any) => (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backups/${record?.spec.backupName}`);
                }}
              >
                <Group gap={5}>
                  <IconDeviceFloppy size={16}/>
                  <Text>{record?.spec.backupName}</Text>
                </Group>
              </Anchor>
            ),
          },

          {
            accessor: 'status.phase',
            title: 'Status',
            sortable: true,
            render: ({ status }: any) => (
              <VeleroResourceStatusBadge status={status?.phase || undefined}/>
            ),
          },
          {
            accessor: 'status.startTimestamp',
            title: 'Started',
            sortable: true,
          },
          {
            accessor: 'status.completionTimestamp',
            title: 'Completed',
            sortable: true,
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
            accessor: 'actions',
            title: (
              <Center>
                <IconClick size={16}/>
              </Center>
            ),
            width: '0%',
            render: renderActions,
          },
        ]}
      />
    </MainStack>
  );
}
