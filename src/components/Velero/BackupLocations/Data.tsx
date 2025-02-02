'use client';

import { useContextMenu } from 'mantine-contextmenu';

import { useEffect, useState } from 'react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Anchor, Center, Group, Text } from '@mantine/core';

import sortBy from 'lodash/sortBy';

import { IconBucket, IconCheck, IconClick, IconServer, IconX } from '@tabler/icons-react';

import { openModal } from '@mantine/modals';

import { useRouter } from 'next/navigation';
import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import DetailActionIcon from '../../Actions/DatatableActionsIcons/DetailActionIcon';
import Toolbar from '../../Toolbar';
import CredentialActionIcon from '../../Actions/DatatableActionsIcons/CredentialActionIcon';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useBackupLocation } from '@/api/BackupLocation/useBackupLocation';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import { SetDefaultBsl } from '@/components/Actions/ActionsForm/SetDefaultBsl';
import CreateBslToolbarIcon from '@/components/Actions/ToolbarActionIcons/CreateBslToolbarIcon';
import { MainStack } from '@/components/Velero/MainStack';

const PAGE_SIZES = [5, 10, 15, 20];

export function BackupLocation() {
  const router = useRouter();
  const { showContextMenu } = useContextMenu();
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
    if (agentValues.isAgentAvailable && reload > 1) getBackupLocation(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getBackupLocation();
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
      <DeleteActionIcon resourceType="bsl" record={record} reload={reload} setReload={setReload} />
    </Group>
  );

  return (
    <MainStack>
      <Toolbar
        title="Backup Storage Locations"
        breadcrumbItem={[
          {
            name: 'Backups Storage Locations',
          },
        ]}
      >
        <CreateBslToolbarIcon setReload={setReload} reload={reload} />
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
        totalRecords={items.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={fetching}
        idAccessor="metadata.uid"
        onRowContextMenu={({ record, event }: any) => {
          showContextMenu([
            {
              key: 'Set as default',
              icon: <IconCheck />,
              disabled: record.spec.default,
              onClick: (e) => {
                e.stopPropagation();
                openModal({
                  title: 'Default BSL',
                  size: 'lg',
                  children: (
                    <SetDefaultBsl
                      name={record.metadata.name}
                      reload={reload}
                      setReload={setReload}
                      def
                    />
                  ),
                });
              },
            },
            {
              key: 'Remove as default',
              icon: <IconX />,
              disabled: !record.spec.default,
              onClick: (e) => {
                e.stopPropagation();
                openModal({
                  title: 'Default BSL',
                  size: 'lg',
                  children: (
                    <SetDefaultBsl
                      name={record.metadata.name}
                      reload={reload}
                      setReload={setReload}
                      def={false}
                    />
                  ),
                });
              },
            },
          ])(event);
        }}
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
                  router.push(`/backup-storage-locations/${record?.metadata?.name}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  {record?.metadata?.name}
                </Group>
              </Anchor>
            ),
          },
          {
            accessor: 'spec.default',
            title: 'Default',
            render: ({ spec }: any) => (
              <>
                {spec.default ? (
                  <VeleroResourceStatusBadge status="true" />
                ) : (
                  <VeleroResourceStatusBadge status="false" />
                )}
              </>
            ),
          },
          {
            accessor: 'spec.provider',
            title: 'provider',
          },
          {
            accessor: 'spec.config.s3Url',
            title: 'S3 Url',
            sortable: true,
          },
          {
            accessor: 'spec.objectStorage.bucket',
            title: 'Bucket/Prefix',
            sortable: true,
            render: ({ spec }: any) => (
              <Group gap={5}>
                <IconBucket size={16} />
                <Text size="sm">{spec.objectStorage.bucket}</Text>
              </Group>
            ),
          },
          {
            accessor: 'spec.accessMode',
            title: 'Access Mode',
            sortable: true,
          },
          {
            accessor: 'spec.credential.name',
            title: 'Cred. Secret Name',
            sortable: true,
            render: ({ spec }: any) => <>{spec.credential && spec.credential.name}</>,
          },
          {
            accessor: 'spec.credential.key',
            title: 'Key Name',
            sortable: true,
            render: ({ spec }: any) => <>{spec.credential && spec.credential.key}</>,
          },
          {
            accessor: 'status.lastValidationTime',
            title: 'Last validation',
            sortable: true,
          },
          {
            accessor: 'status.lastSyncedTime',
            title: 'Last sync',
            sortable: true,
          },
          {
            accessor: 'status.phase',
            title: 'Phase',
            sortable: true,
            render: ({ status }: any) => <VeleroResourceStatusBadge status={status.phase} />,
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
