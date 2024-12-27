'use client';

import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Stack } from '@mantine/core';

import sortBy from 'lodash/sortBy';

import { useServerStatus } from '@/contexts/ServerContext';
import { useNatsClients } from '@/api/Nats/useNatsClients';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

const PAGE_SIZES = [5];

export function Nats() {
  const { data, getNatsClients, fetching } = useNatsClients();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);
  const serverValues = useServerStatus();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    //if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 1230 has been called`, `color: green; font-weight: bold;`);
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane !== undefined)
      getNatsClients();
  }, [reload, serverValues.isServerAvailable, serverValues.isCurrentServerControlPlane]);

  useEffect(() => {
    //if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 1250 has been called`, `color: green; font-weight: bold;`);
    
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    //if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 450 has been called`, `color: green; font-weight: bold;`);

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    setRecords(
      sortStatus.direction === 'desc'
        ? data_sorted.reverse().slice(from, to)
        : data_sorted.slice(from, to)
    );
  }, [page, pageSize, sortStatus, items]);

  /*const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <CredentialActionIcon name={record.metadata.name} record={record} />
      <DetailActionIcon name={record.metadata.name} record={record} />
    </Group>
  );*/

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Nats connections">
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
              accessor: 'cid',

              sortable: true,
              width: 70,
            },
            {
              accessor: 'name',

              sortable: true,
            },
            {
              accessor: 'kind',

              sortable: true,
            },
            {
              accessor: 'type',
              sortable: true,
            },
            {
              accessor: 'ip',
              sortable: true,
            },
            {
              accessor: 'port',
              sortable: true,
            },
            {
              accessor: 'start',
              sortable: true,
            },
            {
              accessor: 'last_activity',
              sortable: true,
            },
            {
              accessor: 'rtt',
              sortable: true,
            },
            {
              accessor: 'uptime',
              sortable: true,
            },
            {
              accessor: 'idle',
              sortable: true,
            },
            {
              accessor: 'pending_bytes',
              sortable: true,
            },
            {
              accessor: 'in_msgs',
              sortable: true,
            },
            {
              accessor: 'out_msgs',
              sortable: true,
            },
            {
              accessor: 'in_bytes',
              sortable: true,
            },
            {
              accessor: 'out_bytes',
              sortable: true,
            },
            {
              accessor: 'subscriptions',
              sortable: true,
            },
            {
              accessor: 'lang',
              sortable: true,
            },
            {
              accessor: 'version',
              sortable: true,
            },
            /*{
              accessor: 'actions',
              title: (
                <Center>
                  <IconClick size={16} />
                </Center>
              ),
              width: '0%',
              render: renderActions,
            },*/
          ]}
        />
      </Stack>
    </>
  );
}
