'use client';

import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { useServerStatus } from '@/contexts/ServerContext';

import { useNatsClients } from '@/api/Nats/useNatsClients';

import { MainStack } from '@/components/Commons/MainStack';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

const PAGE_SIZES = [5, 10, 15];

export function Nats() {
  const {
    data,
    getNatsClients,
    fetching
  } = useNatsClients();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);
  const serverValues = useServerStatus();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane !== undefined) {
      getNatsClients();
    }
  }, [reload, serverValues.isServerAvailable, serverValues.isCurrentServerControlPlane]);

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

  return (
    <MainStack>
      <Toolbar title="Nats connections" breadcrumbItem={[{ name: 'Nats Connections' }]}>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>

      <DataTable
        minHeight={160}
        withTableBorder
        borderRadius="sm"
        idAccessor="cid"
        // withColumnBorders
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
    </MainStack>
  );
}
