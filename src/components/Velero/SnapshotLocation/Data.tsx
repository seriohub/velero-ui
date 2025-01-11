'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

import { Center, Group, Stack } from '@mantine/core';
import { IconClick } from '@tabler/icons-react';

import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../../Toolbar';
import DetailActionIcon from '../../Actions/DatatableActionsIcons/DetailActionIcon';
import CredentialActionIcon from '../../Actions/DatatableActionsIcons/CredentialActionIcon';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useSnapshotLocation } from '@/api/SnapshotLocation/useSnapshotLocation';

const PAGE_SIZES = [5];

export function SnapshotLocation() {
  const { data, getSnapshotLocation, error, fetching } = useSnapshotLocation();
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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 800 has been called`, `color: green; font-weight: bold;`);
    // console.log('reload', reload);
    if (agentValues.isAgentAvailable && reload > 1) getSnapshotLocation(true);
  }, [reload]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 801 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) getSnapshotLocation();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 810 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 820 has been called`, `color: green; font-weight: bold;`);
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
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar
          title="Volume Snapshot Location"
          breadcrumbItem={{ name: 'Volume Snapshot locations', href: '/snapshot-locations' }}
        >
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
          // idAccessor="id"
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
              accessor: 'id',
              title: 'Id',
              sortable: true,
              width: 70,
            },
            {
              accessor: 'metadata.name',
              title: 'Name',
              sortable: true,
            },

            { accessor: 'spec.provider', title: 'Provider', sortable: true },
            { accessor: 'spec.config.bucket', title: 'Bucket/Prefix', sortable: true },
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
      </Stack>
    </>
  );
}
