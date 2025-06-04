'use client';

import { useMemo } from 'react';
import { Box, Group, } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function DeleteBackupRequestMRT({
                                         fetching,
                                         setReload,
                                         items,
                                         enableTopToolbar = false,
                                       }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind} record={record}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'metadata.name',
        header: 'Name',
      },
      {
        accessorKey: 'spec.backupName',
        header: 'Target Backup Name',
      },
      {
        accessorKey: 'status.phase',
        header: 'Status',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row.original?.status?.phase || undefined}/>
        ),
      },
      {
        accessorKey: 'status.errors',
        header: 'Errors',
        sortable: true,
        width: 500,
        ellipsis: true,
      }
    ],
    [],
  );

  return <Box
    style={{
      height: 253,
      transition: 'height 0.2s ease',
      boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 999,
    }}
  >
    <GenericMRTTableLayout
      title='delete-backup-requests'
      fetching={fetching}
      items={items || []}
      setReload={setReload}
      columns={columns}
      enablePagination={false}
      initialState={{
        density: 'xs',
      }}
      renderRowActions={({ row }: { row: MRT_Row<any> }) => <>{renderActions(row?.original)}</>}
      mantinePaperPropsContent={{
        'style': {
          'border': 'None',
        }
      }
      }
      mantineTableContainerPropsContent={{ style: { height: enableTopToolbar ? "196px" : "253px" } }}
      enableBottomToolbar={false}
      enableTopToolbar={enableTopToolbar}
    />
  </Box>

}
