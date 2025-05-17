'use client';

import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import { useContextMenu } from 'mantine-contextmenu';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Anchor, Center, Group, Text } from '@mantine/core';

import { IconBucket, IconCheck, IconClick, IconServer, IconX } from '@tabler/icons-react';

import { openModal } from '@mantine/modals';

import { useRouter } from 'next/navigation';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useBackupLocation } from '@/api/BackupLocation/useBackupLocation';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '../../../Display/Toolbar';
import { DataFetchedInfo } from '../../../Display/DataFetchedInfo';
import ReloadData from '@/components/Inputs/ReloadData';

import CredentialActionIcon from '@/components/Features/Velero/Commons/Actions/CredentialActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { SetDefaultBsl } from '@/components/Features/Velero/BackupLocations/Forms/SetDefaultBsl';
import CreateBslToolbar from '@/components/Features/Velero/BackupLocations/Actions/CreateBslToolbar';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import EditBslAction from '@/components/Features/Velero/BackupLocations/Actions/EditBSLAction';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { useWatchResources } from '@/hooks/useWatchResources';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function BslDatatable() {
  const router = useRouter();
  const { showContextMenu } = useContextMenu();
  const {
    data,
    getBackupLocation,
    fetching,
    fetchedTime
  } = useBackupLocation();
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
  useWatchResources('backupstoragelocations');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backupstoragelocations') {
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
    if (agentValues.isAgentAvailable && reload > 1) getBackupLocation(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getBackupLocation();
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
      <CredentialActionIcon name={record.metadata.name} record={record}/>
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <EditBslAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="bsl" record={record} setReload={setReload}/>
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
        <CreateBslToolbar setReload={setReload} reload={reload}/>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>
      <DataFetchedInfo fetchedTime={fetchedTime}/>
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
        fetching={fetching && records?.length === 0}
        idAccessor="metadata.uid"
        onRowContextMenu={({
                             record,
                             event
                           }: any) => {
          showContextMenu([
            {
              key: 'Set as default',
              icon: <IconCheck/>,
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
              icon: <IconX/>,
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
                  <IconServer size={16}/>
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
                  <VeleroResourceStatusBadge status="true"/>
                ) : (
                  <VeleroResourceStatusBadge status="false"/>
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
                <IconBucket size={16}/>
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
            render: ({ status }: any) => (
              <VeleroResourceStatusBadge status={status?.phase || undefined}/>
            ),
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
