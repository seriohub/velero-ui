'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

import { Anchor, Center, Group, Text } from '@mantine/core';
import { IconBucket, IconCamera, IconClick } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../../Toolbar';
import DetailActionIcon from '../../Actions/DatatableActionsIcons/DetailActionIcon';
import CredentialActionIcon from '../../Actions/DatatableActionsIcons/CredentialActionIcon';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useSnapshotLocation } from '@/api/SnapshotLocation/useSnapshotLocation';

import CreateVslToolbarIcon from '@/components/Actions/ToolbarActionIcons/CreateVslToolbarIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import { MainStack } from '@/components/Velero/MainStack';

const PAGE_SIZES = [5];

export function SnapshotLocation() {
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

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) getSnapshotLocation(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getSnapshotLocation();
  }, [agentValues.isAgentAvailable]);

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

    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus, items]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <CredentialActionIcon name={record.metadata.name} record={record} />
      <DetailActionIcon name={record.metadata.name} record={record} />
      <DeleteActionIcon resourceType="vsl" record={record} reload={reload} setReload={setReload} />
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
        <CreateVslToolbarIcon setReload={setReload} reload={reload} />
        <RefreshDatatable setReload={setReload} reload={reload} />
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
        fetching={fetching}
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
            accessor: 'spec.config.s3Url',
            title: 'S3 Url',
            sortable: true,
          },
          {
            accessor: 'spec.config.bucket',
            title: 'Bucket',
            sortable: true,
            render: ({ spec }: any) => (
              <Group gap={5}>
                <IconBucket size={16} />
                <Text size="sm">{spec.config.bucket}</Text>
              </Group>
            ),
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
