'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { ActionIcon, Center, Group, Stack, CopyButton, Tooltip, rem } from '@mantine/core';

import { IconClick, IconCheck, IconCopy, IconAnalyze, IconLockOpen } from '@tabler/icons-react';

import { useContextMenu } from 'mantine-contextmenu';

import { useApiGet } from '@/hooks/useApiGet';

import DetailActionIcon from '../Actions/DatatableActionsIcons/DetailActionIcon';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../Toolbar';

const PAGE_SIZES = [5, 10, 15, 20];

export function RepoLocation() {
  const { showContextMenu } = useContextMenu();

  const { data, getData, error, fetching } = useApiGet();
  const { data: locks, getData: getLocks } = useApiGet();
  const { data: unlock, getData: tryUnlock } = useApiGet();
  const { data: dateCheck, getData: check } = useApiGet();

  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    getData('/api/v1/repo/get');
  }, [reload]);

  useEffect(() => {
    getData('/api/v1/repo/get');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data.payload);
    } else setItems([]);
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
  }, [page, pageSize, sortStatus, data]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <DetailActionIcon name={record.metadata.name} record={record} />
    </Group>
  );

  useEffect(() => {
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
    if (unlock !== undefined) {
      getLocks('/api/v1/repo/locks/get', `repository_url=${Object.keys(unlock.payload)[0]}`);
    }
  }, [unlock]);

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Repo">
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
          onRowContextMenu={({ record, event }) =>
            showContextMenu([
              {
                key: 'Check',
                icon: <IconAnalyze size={16} />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () =>
                  check(
                    '/api/v1/repo/check',
                    `repository_url=${record.spec.resticIdentifier}`
                  ),
              },
              {
                key: 'Check if locked',
                icon: <IconAnalyze size={16} />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () =>
                  getLocks(
                    '/api/v1/repo/locks/get',
                    `repository_url=${record.spec.resticIdentifier}`
                  ),
              },
              {
                key: 'Unlock',
                icon: <IconLockOpen size={16} />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () =>
                  tryUnlock(
                    '/api/v1/repo/unlock',
                    `repository_url=${record.spec.resticIdentifier}`
                  ),
              },
              {
                key: 'Unlock --remove-all',
                title: 'Unlock --remove-all',
                icon: <IconLockOpen size={16} />,
                disabled: record.spec.repositoryType != 'restic',
                onClick: () =>
                  tryUnlock(
                    '/api/v1/repo/unlock',
                    `repository_url=${record.spec.resticIdentifier}&remove_all=True`
                  ),
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
            },
            { accessor: 'spec.volumeNamespace', title: 'Volume Namespace', sortable: true },
            {
              accessor: 'spec.backupStorageLocation',
              title: 'Backup Storage Location',
              sortable: true,
            },
            { accessor: 'spec.repositoryType', title: 'Repository Type', sortable: true },
            { accessor: 'locks', title: 'Locks', sortable: true },
            {
              accessor: 'spec.resticIdentifier',
              title: 'Identifier',
              sortable: true,
              render: ({ spec }) => (
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
