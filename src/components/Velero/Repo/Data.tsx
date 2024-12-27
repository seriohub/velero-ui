'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { ActionIcon, Center, Group, Stack, CopyButton, Tooltip, rem } from '@mantine/core';

import { IconClick, IconCheck, IconCopy, IconAnalyze, IconLockOpen } from '@tabler/icons-react';

import { useContextMenu } from 'mantine-contextmenu';

import DetailActionIcon from '../../Actions/DatatableActionsIcons/DetailActionIcon';
import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../../Toolbar';
import InfoRepository from '../../Actions/DatatableActionsIcons/InfoRepository';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useRepositories } from '@/api/RepositoryLocation/useRepositories';
import { useRepositoryLocks } from '@/api/RepositoryLocation/useRepositoryLocks';
import { useRepositoryUnlock } from '@/api/RepositoryLocation/useRepositoryUnlock';
import { useRepositoryCheck } from '@/api/RepositoryLocation/useRepositoryCheck';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

const PAGE_SIZES = [5, 10, 15, 20];

export function RepoLocation() {
  const { showContextMenu } = useContextMenu();
  const agentValues = useAgentStatus();

  const { data, getRepositories, error, fetching } = useRepositories();
  const { data: locks, getRepositoryLocks } = useRepositoryLocks();
  const { data: unlock, getRepositoryUnlock } = useRepositoryUnlock();
  const { data: dateCheck, getRepositoryCheck } = useRepositoryCheck();

  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[2]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 640 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload > 1) getRepositories(true);
  }, [reload]);

  useEffect(() => {
    //if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 640 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) getRepositories();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 650 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
  }, [data]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 660 has been called`, `color: green; font-weight: bold;`);
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
      <DetailActionIcon name={record.metadata.name} record={record} />
      <InfoRepository
        repositoryURL={record.spec.resticIdentifier}
        backupStorageLocation={record.spec.backupStorageLocation}
        repositoryName={record.metadata.name}
        repositoryType={record.spec.repositoryType}
        volumeNamespace={record.spec.volumeNamespace}
      />
    </Group>
  );

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 670 has been called`, `color: green; font-weight: bold;`);
    if (locks !== undefined) {
      setRecords(
        records.filter(function (obj) {
          if (obj.spec.resticIdentifier == Object.keys(locks.payload)[0]) {
            if (locks.payload[Object.keys(locks.payload)[0]].length > 0) {
              obj.locks = locks.payload[Object.keys(locks.payload)[0]].join('\n');
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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 680 has been called`, `color: green; font-weight: bold;`);
    if (unlock !== undefined) {
      getRepositoryLocks(Object.keys(unlock.payload)[0]);
    }
  }, [unlock]);

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Repo" breadcrumbItem={{ name: 'Repository', href: '/repos' }}>
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
          onRowContextMenu={({ record, event }: any) =>
            showContextMenu([
              {
                key: 'Check',
                icon: <IconAnalyze />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () => getRepositoryCheck(record.spec.resticIdentifier),
              },
              {
                key: 'Check if locked',
                icon: <IconAnalyze />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () => getRepositoryLocks(record.spec.resticIdentifier),
              },
              {
                key: 'Unlock',
                icon: <IconLockOpen />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () => getRepositoryUnlock(record.spec.resticIdentifier),
              },
              {
                key: 'Unlock --remove-all',
                title: 'Unlock --remove-all',
                icon: <IconLockOpen />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () => getRepositoryUnlock(record.spec.resticIdentifier, true),
              },
            ])(event)
          }
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
              accessor: 'status.phase',
              title: 'Status',
              sortable: true,
              render: ({ status }: any) => (
                <>{<VeleroResourceStatusBadge status={status.phase} />}</>
              ),
            },
            { accessor: 'spec.volumeNamespace', title: 'Volume Namespace', sortable: true },
            {
              accessor: 'spec.backupStorageLocation',
              title: 'Backup Storage Location',
              sortable: true,
            },
            {
              accessor: 'spec.repositoryType',
              title: 'Repository Type',
              sortable: true,
              render: ({ spec }: any) => (
                <>{<VeleroResourceStatusBadge status={spec.repositoryType} />}</>
              ),
            },
            { accessor: 'locks', title: 'Locks', sortable: true },
            {
              accessor: 'spec.resticIdentifier',
              title: 'Identifier',
              sortable: true,
              render: ({ spec }: any) => (
                <>
                  {spec.resticIdentifier && (
                    <>
                      <Group gap={5}>
                        {spec.resticIdentifier}
                        <CopyButton value={spec.resticIdentifier} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                variant="subtle"
                                onClick={copy}
                              >
                                {copied ? (
                                  <IconCheck style={{ width: rem(16) }} />
                                ) : (
                                  <IconCopy style={{ width: rem(16) }} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </>
                  )}
                </>
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
