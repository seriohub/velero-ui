'use client';

import { useMemo } from 'react';

import { Anchor, Group, Text, } from '@mantine/core';
import { IconBucket, IconServer, } from '@tabler/icons-react';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import CredentialActionIcon from '@/components/Features/Velero/Commons/Actions/CredentialActionIcon';
import EditBslAction from '@/components/Features/Velero/BackupLocations/Actions/EditBSLAction';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { highlightMultiple } from '@/utils/highlightMultiple';

export function BslMRT({
                         fetching,
                         setReload,
                         items,
                         customActions,
                       }: any) {

  const router = useRouter();

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <CredentialActionIcon name={record.metadata.name} record={record}/>
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <EditBslAction record={record} setReload={setReload}/>
      <DeleteAction resourceType="bsl" record={record} setReload={setReload}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'metadata.name',
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
                router.push(`/backup-storage-locations/${name}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16}/>
                <Text truncate="end">
                  {highlightMultiple(name, highlights)}
                </Text>
              </Group>
            </Anchor>
          );
        },
      },
      {
        id: 'spec.default',
        accessorFn: (row) => (row.spec?.default ? 'True' : 'False'),
        header: 'Default',
        Cell: ({ row }) => (
          <>
            {row?.original?.spec.default ? (
              <VeleroResourceStatusBadge status="true"/>
            ) : (
              <VeleroResourceStatusBadge status="false"/>
            )}
          </>
        ),
      },
      {
        accessorKey: 'spec.provider',
        header: 'provider',
      },
      {
        accessorKey: 'spec.config.s3Url',
        header: 'S3 Url',
      },
      {
        accessorKey: 'spec.objectStorage.bucket',
        header: 'Bucket/Prefix',
        Cell: ({ row }) => (
          <Group gap={5}>
            <IconBucket size={16}/>
            <Text size="sm">{row?.original?.spec.objectStorage.bucket}</Text>
          </Group>
        ),
      },
      {
        accessorKey: 'spec.accessMode',
        header: 'Access Mode',
      },
      {
        accessorKey: 'spec.credential.name',
        header: 'Cred. Secret Name',
        Cell: ({ row }) => <>{row?.original?.spec.credential && row?.original?.spec.credential.name}</>,
      },
      {
        accessorKey: 'spec.credential.key',
        header: 'Key Name',
        Cell: ({ row }) => <>{row?.original?.spec.credential && row?.original?.spec.credential.key}</>,
      },
      {
        accessorKey: 'status.lastSyncedTime',
        header: 'Last sync',
      },
      {
        accessorKey: 'status.phase',
        header: 'Phase',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row?.original?.status?.phase || undefined}/>
        ),
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='bsl'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    initialState={{
      columnVisibility: {
        'spec.config.s3Url': false,
        'spec.objectStorage.bucket': false,
        'spec.credential.name': false,
        'spec.credential.key': false,
      },
    }}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
