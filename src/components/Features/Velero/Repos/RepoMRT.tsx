'use client';

import { useEffect, useMemo } from 'react';
import { ActionIcon, Anchor, CopyButton, Group, Menu, rem, Text, Tooltip, } from '@mantine/core';
import { IconCheck, IconCopy, IconDatabase, IconDots, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import { useRepositoryLocks } from '@/api/RepositoryLocation/useRepositoryLocks';
import { useRepositoryUnlock } from '@/api/RepositoryLocation/useRepositoryUnlock';
import { useRepositoryCheck } from '@/api/RepositoryLocation/useRepositoryCheck';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import InfoRepositoryActionIcon from '@/components/Features/Velero/Repos/InfoRepositoryActionIcon';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function RepoMRT({
                          fetching,
                          setReload,
                          items,
                        }: any) {

  const router = useRouter();

  /* repo operations*/
  const {
    data: locks,
    getRepositoryLocks
  } = useRepositoryLocks();
  const {
    data: unlock,
    getRepositoryUnlock
  } = useRepositoryUnlock();
  const { getRepositoryCheck } = useRepositoryCheck();

  useEffect(() => {
    if (unlock !== undefined) {
      getRepositoryLocks(unlock?.bsl, unlock?.repositoryUrl);
    }
  }, [unlock]);
  /* end operations*/

  const renderActions = (row: any) => (
    <Group gap={2} wrap="nowrap">

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="light"><IconDots/></ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Restic Repository</Menu.Label>
          <Menu.Item
            onClick={() => getRepositoryCheck(row?.spec?.backupStorageLocation, row?.spec?.resticIdentifier)}
            disabled={row?.spec?.repositoryType !== 'restic'}>
            Check
          </Menu.Item>
          <Menu.Item
            onClick={() => getRepositoryLocks(row?.spec?.backupStorageLocation, row?.spec?.resticIdentifier)}
            disabled={row?.spec?.repositoryType !== 'restic'}>
            Check if locked
          </Menu.Item>
          <Menu.Item
            onClick={() => getRepositoryUnlock(
              row?.spec?.backupStorageLocation,
              row?.spec?.resticIdentifier
            )}
            disabled={row?.spec?.repositoryType !== 'restic'}>
            Unlock
          </Menu.Item>
          <Menu.Item
            onClick={() => getRepositoryUnlock(
              row?.spec?.backupStorageLocation,
              row?.spec?.resticIdentifier,
              true
            )}
            disabled={row?.spec?.repositoryType !== 'restic'}>
            Unlock--remove-all
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <DescribeActionIcon resourceType={row?.kind} record={row}/>
      <InfoRepositoryActionIcon
        repositoryURL={row?.spec?.resticIdentifier}
        backupStorageLocation={row?.spec?.backupStorageLocation}
        repositoryName={row?.metadata?.name}
        repositoryType={row?.spec?.repositoryType}
        volumeNamespace={row?.spec?.volumeNamespace}
      />
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'metadata.name',
        accessorFn: (row) => row?.metadata?.name ?? '',
        header: 'Name',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const name = row?.original?.metadata?.name ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/repos/${name}`);
              }}
            >
              <Group gap={5}>
                <IconDatabase size={16}/>
                <Text truncate="end">
                  {highlightMultiple(name, highlights)}
                </Text>
              </Group>
            </Anchor>
          );
        },
      },
      {
        id: 'status.phase',
        accessorFn: (row) => row?.status?.phase ?? '',
        header: 'Status',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row?.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'spec.volumeNamespace',
        accessorFn: (row) => row?.spec?.volumeNamespace ?? '',
        header: 'Volume Namespace',
      },
      {
        id: 'spec.backupStorageLocation',
        accessorFn: (row) => row?.spec?.backupStorageLocation ?? '',
        header: 'Backups Storage Location',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const location = row?.original?.spec?.backupStorageLocation ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          return (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backup-storage-locations/${location}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16}/>
                <Text truncate="end">
                  {highlightMultiple(location, highlights)}
                </Text>
              </Group>
            </Anchor>
          );
        },
      },
      {
        id: 'spec.repositoryType',
        accessorFn: (row) => row?.spec?.repositoryType ?? '',
        header: 'Repository Type',
        Cell: ({ row }) => <VeleroResourceStatusBadge status={row?.original?.spec?.repositoryType}/>,
      },
      {
        id: 'spec.resticIdentifier',
        accessorFn: (row) => row?.spec?.resticIdentifier ?? '',
        header: 'Identifier',
        Cell: ({
                 row,
                 column,
                 table
               }) => {
          const resticId = row?.original?.spec?.resticIdentifier ?? '';
          const globalFilter = table.getState().globalFilter ?? '';
          const columnFilter = column.getFilterValue() ?? '';
          const highlights = [globalFilter, columnFilter]
            .map(h => h.toString().trim())
            .filter(Boolean);

          if (!resticId) return null;

          return (
            <Group gap={5}>
              <CopyButton value={resticId} timeout={2000}>
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
              <Text size="sm">{highlightMultiple(resticId, highlights)}</Text>
            </Group>
          );
        },
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='repos'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'spec.resticIdentifier': false,
      }
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
  />
}
