'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Box, CopyButton, Group, Tooltip, } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

export function DeleteBackupRequestMRT({
                                         fetching,
                                         setReload,
                                         items,
                                         enableTopToolbar = false,
                                       }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <DeleteAction
        resourceType="delete-backup-request"
        record={record}
        setReload={setReload}
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
               }) => {
          const name = row?.original?.metadata?.name ?? '';

          return (
            <Group gap={5}>
              <CopyButton value={name} timeout={2000}>
                {({
                    copied,
                    copy
                  }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy backup name'} withArrow position="right">
                    <ActionIcon
                      color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'}
                      variant="light"
                      size="sm"
                      onClick={copy}
                      p={0}
                      m={0}
                    >
                      {copied ? <IconCheck size={14}/> : <IconCopy size={16}/>}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              {name}
            </Group>
          );
        },
      },
      {
        id: 'spec.backupName',
        accessorFn: (row) => row?.spec?.backupName ?? '',
        header: 'Target Backup Name',
      },
      {
        id: 'status.phase',
        accessorFn: (row) => row?.status?.phase ?? '',
        header: 'Status',
        Cell: ({ row }) => (
          <VeleroResourceStatusBadge status={row.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'status.errors',
        accessorFn: (row) => row?.status?.errors ?? '',
        header: 'Errors',
      },
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
      name='delete-backup-requests'
      fetching={fetching}
      items={items || []}
      setReload={setReload}
      columns={columns}
      enablePagination={false}
      showLoading={false}
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
