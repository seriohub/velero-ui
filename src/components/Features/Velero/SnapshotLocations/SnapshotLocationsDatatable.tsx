'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

import { Anchor, Center, Group, Text } from '@mantine/core';
import { IconCamera, IconClick } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';

import { debounce } from 'lodash';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useSnapshotLocation } from '@/api/SnapshotLocation/useSnapshotLocation';

import { MainStack } from '@/components/Commons/MainStack';

import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import CredentialActionIcon from '@/components/Features/Velero/Commons/Actions/CredentialActionIcon';
import CreateVslToolbar from '@/components/Features/Velero/SnapshotLocations/Actions/CreateVslToolbar';
import EditVslAction from '@/components/Features/Velero/SnapshotLocations/Actions/EditVSLAction';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function SnapshotLocationsDatatable() {
  const router = useRouter();
  const { data, getSnapshotLocation, fetching } = useSnapshotLocation();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  /* watch */
  useWatchResources('volumesnapshotlocations');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'volumesnapshotlocations') {
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
    if (agentValues.isAgentAvailable && reload > 1) getSnapshotLocation(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getSnapshotLocation();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus, items]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <CredentialActionIcon name={record.metadata.name} record={record} />
      <DescribeActionIcon resourceType={record.kind} record={record} />
      <EditVslAction record={record} setReload={setReload} />
      <DeleteAction resourceType="vsl" record={record} setReload={setReload} />
    </Group>
  );

  return (
    <MainStack>
      <Toolbar
        title="Volume Snapshot Location"
        breadcrumbItem={[
          {
            name: 'Volume Snapshot locations',
          },
        ]}
      >
        <CreateVslToolbar setReload={setReload} reload={reload} />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />
      <DataTable
        minHeight={160}
        withTableBorder
        borderRadius="sm"
        // withColumnBorders
        striped
        highlightOnHover
        records={records}
        idAccessor="metadata.name"
        totalRecords={items.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={fetching && records?.length === 0}
        columns={[
          {
            accessor: 'metadata.name',
            title: 'Name',
            sortable: true,
            render: (record: any) => (
              <Anchor
                size="sm"
                onClick={() => {
                  // console.log(record);
                  router.push(`/volume-snapshot-locations/${record?.metadata?.name}`);
                }}
              >
                <Group gap={5}>
                  <IconCamera size={16} />
                  <Text>{record?.metadata?.name}</Text>
                </Group>
              </Anchor>
            ),
          },

          {
            accessor: 'spec.provider',
            title: 'Provider',
            sortable: true,
          },

          {
            accessor: 'spec.credential.name',
            title: 'Cred. Secret Name',
            sortable: true,
            render: ({ spec }: any) => (
              <>{spec.credential && spec.credential.name && spec.credential.name}</>
            ),
          },
          {
            accessor: 'spec.credential.key',
            title: 'Key Name',
            sortable: true,
            render: ({ spec }: any) => (
              <>{spec.credential && spec.credential.key && <>{spec.credential.key}</>}</>
            ),
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
    </MainStack>
  );
}
