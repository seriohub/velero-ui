'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { ActionIcon, Center, Group, CopyButton, Tooltip, rem, Anchor, Text } from '@mantine/core';

import {
  IconClick,
  IconCheck,
  IconCopy,
  IconAnalyze,
  IconLockOpen,
  IconServer,
  IconDatabase,
} from '@tabler/icons-react';

import { useContextMenu } from 'mantine-contextmenu';

import { useRouter } from 'next/navigation';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useRepositories } from '@/api/RepositoryLocation/useRepositories';
import { useRepositoryLocks } from '@/api/RepositoryLocation/useRepositoryLocks';
import { useRepositoryUnlock } from '@/api/RepositoryLocation/useRepositoryUnlock';
import { useRepositoryCheck } from '@/api/RepositoryLocation/useRepositoryCheck';

import { MainStack } from '@/components/Commons/MainStack';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import DetailActionIcon from '@/components/Features/Velero/Commons/Actions/DetailActionIcon';
import InfoRepositoryActionIcon from '@/components/Features/Velero/Repos/InfoRepositoryActionIcon';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { useWatchResources } from '@/hooks/useWatchResources';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function ReposDatatable() {
  const router = useRouter();
  const { showContextMenu } = useContextMenu();
  const agentValues = useAgentStatus();

  const {
    data,
    getRepositories,
    fetching,
    fetchedTime
  } = useRepositories();
  const {
    data: locks,
    getRepositoryLocks
  } = useRepositoryLocks();
  const {
    data: unlock,
    getRepositoryUnlock
  } = useRepositoryUnlock();
  const { getRepositoryCheck } = useRepositoryCheck();

  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[2]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  /* watch */
  useWatchResources('backuprepositories');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'backuprepositories') {
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
    if (agentValues.isAgentAvailable && reload > 1) getRepositories(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getRepositories();
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
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <InfoRepositoryActionIcon
        repositoryURL={record.spec.resticIdentifier}
        backupStorageLocation={record.spec.backupStorageLocation}
        repositoryName={record.metadata.name}
        repositoryType={record.spec.repositoryType}
        volumeNamespace={record.spec.volumeNamespace}
      />
    </Group>
  );

  useEffect(() => {
    if (locks !== undefined) {
      setRecords(
        records.filter((obj) => {
          if (obj.spec.resticIdentifier === Object.keys(locks)[0]) {
            if (locks[Object.keys(locks)[0]].length > 0) {
              obj.locks = locks[Object.keys(locks)[0]].join('\n');
            } else {
              obj.locks = 'No locks';
            }
          }
          return obj;
        })
      );
    }
  }, [locks]);

  useEffect(() => {
    if (unlock !== undefined) {
      getRepositoryLocks(unlock?.bsl, unlock?.repositoryUrl);
    }
  }, [unlock]);

  return (
    <MainStack>
      <Toolbar
        title="Repo"
        breadcrumbItem={[
          {
            name: 'Repository',
          },
        ]}
      >
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
        onRowContextMenu={({
                             record,
                             event
                           }: any) =>
          showContextMenu([
            {
              key: 'Check',
              icon: <IconAnalyze/>,
              disabled: record.spec.repositoryType !== 'restic',
              onClick: () =>
                getRepositoryCheck(record.spec.backupStorageLocation, record.spec.resticIdentifier),
            },
            {
              key: 'Check if locked',
              icon: <IconAnalyze/>,
              disabled: record.spec.repositoryType !== 'restic',
              onClick: () =>
                getRepositoryLocks(record.spec.backupStorageLocation, record.spec.resticIdentifier),
            },
            {
              key: 'Unlock',
              icon: <IconLockOpen/>,
              disabled: record.spec.repositoryType !== 'restic',
              onClick: () =>
                getRepositoryUnlock(
                  record.spec.backupStorageLocation,
                  record.spec.resticIdentifier
                ),
            },
            {
              key: 'Unlock --remove-all',
              title: 'Unlock --remove-all',
              icon: <IconLockOpen/>,
              disabled: record.spec.repositoryType !== 'restic',
              onClick: () =>
                getRepositoryUnlock(
                  record.spec.backupStorageLocation,
                  record.spec.resticIdentifier,
                  true
                ),
            },
          ])(event)
        }
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
                  router.push(`/repos/${record?.metadata?.name}`);
                }}
              >
                <Group gap={5}>
                  <IconDatabase size={16}/>
                  {record?.metadata?.name}
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
            accessor: 'spec.volumeNamespace',
            title: 'Volume Namespace',
            sortable: true,
          },
          {
            accessor: 'spec.backupStorageLocation',
            title: 'Backups Storage Location',
            sortable: true,
            render: (record: any) => (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${record?.spec.backupStorageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16}/>
                  <Text>{record?.spec.backupStorageLocation}</Text>
                </Group>
              </Anchor>
            ),
          },
          {
            accessor: 'spec.repositoryType',
            title: 'Repository Type',
            sortable: true,
            render: ({ spec }: any) => <VeleroResourceStatusBadge status={spec.repositoryType}/>,
          },
          {
            accessor: 'locks',
            title: 'Locks',
            sortable: true,
          },
          {
            accessor: 'spec.resticIdentifier',
            title: 'Identifier',
            sortable: true,
            render: ({ spec }: any) => (
              <>
                {spec.resticIdentifier && (
                  <Group gap={5}>
                    <CopyButton value={spec.resticIdentifier} timeout={2000}>
                      {({
                          copied,
                          copy
                        }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            variant="transparent"
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck style={{ width: rem(16) }}/>
                            ) : (
                              <IconCopy style={{ width: rem(16) }}/>
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                    <Text size="sm">{spec.resticIdentifier}</Text>
                  </Group>
                )}
              </>
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
