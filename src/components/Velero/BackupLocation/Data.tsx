'use client';

import { useEffect, useState } from 'react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Center, Group, Stack } from '@mantine/core';

import sortBy from 'lodash/sortBy';

import { IconClick } from '@tabler/icons-react';

import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import DetailActionIcon from '../../Actions/DatatableActionsIcons/DetailActionIcon';
import Toolbar from '../../Toolbar';
import CredentialActionIcon from '../../Actions/DatatableActionsIcons/CredentialActionIcon';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useBackupLocation } from '@/api/BackupLocation/useBackupLocation';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

const PAGE_SIZES = [5];

export function BackupLocation() {
  const { data, getBackupLocation, fetching } = useBackupLocation();
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
    //  console.log(`%cuseEffect 430 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload > 1) getBackupLocation(true);
  }, [reload]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 430 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) getBackupLocation();
  }, [agentValues.isAgentAvailable]);

  //useEffect(() => {
  //  getData('/v1/backup-location/get');
  //}, []);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 440 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
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
          title="Backup Location"
          breadcrumbItem={{ name: 'Backup locations', href: '/backup-locations' }}
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
            {
              accessor: 'spec.provider',
              title: 'provider',
            },
            { accessor: 'spec.objectStorage.bucket', title: 'Bucket/Prefix', sortable: true },
            {
              accessor: 'status.phase',
              title: 'Phase',
              sortable: true,
              render: ({ status }: any) => (
                <>{<VeleroResourceStatusBadge status={status.phase} />}</>
              ),
            },
            { accessor: 'spec.accessMode', title: 'Access Mode', sortable: true },
            {
              accessor: 'spec.credential.name',
              title: 'Cred. Secret Name',
              sortable: true,
              render: ({ spec }) => <>{spec.credential && spec.credential.name}</>,
            },
            {
              accessor: 'spec.credential.key',
              title: 'Key Name',
              sortable: true,
              render: ({ spec }) => <>{spec.credential && spec.credential.key}</>,
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
