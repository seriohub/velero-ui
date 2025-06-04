'use client';

import { useMemo } from 'react';
import { Group } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import EditSCMapping from '@/components/Features/Velero/SCMapping/EditSCMapping';
import DeleteSCMappingActionIcon from '@/components/Features/Velero/SCMapping/DeleteSCMappingActionIcon';

export function SCMMRT({
                         fetching,
                         setReload,
                         items,
                         customActions
                       }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <EditSCMapping record={record} setReload={setReload}/>
      <DeleteSCMappingActionIcon record={record} setReload={setReload}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'oldStorageClass',
        header: 'Storage Class in backup',
      },
      {
        accessorKey: 'newStorageClass',
        header: 'New Storage Class used for restore',
      },
    ],
    [],
  );

  return <GenericMRTTableLayout
    name='scm'
    fetching={fetching}
    items={items || []}
    setReload={setReload}
    columns={columns}
    renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
    customActions={customActions}
  />
}
