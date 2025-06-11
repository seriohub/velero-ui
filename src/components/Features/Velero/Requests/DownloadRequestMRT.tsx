'use client';

import React, { useMemo } from 'react';
import { ActionIcon, Box, CopyButton, Group, rem, Tooltip, } from '@mantine/core';
import { type MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import { getExpirationString } from '@/utils/getExpirationString';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import { GenericMRTTableLayout } from '@/components/Features/Velero/GenericMRTTableLayout';
import DownloadAction from '@/components/Features/Velero/Requests/Actions/DownloadAction';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function DownloadRequestMRT({
                                     fetching,
                                     setReload,
                                     items,
                                     enableTopToolbar = false,
                                   }: any) {

  const renderActions = (record: any) => (
    <Group gap={2} wrap="nowrap">
      <CopyButton value={record?.status?.downloadURL} timeout={2000}>
        {({
            copied,
            copy
          }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy URL'} withArrow position="right">
            <ActionIcon color={copied ? 'teal' : ''} variant="transparent" onClick={copy}>
              {copied ? (
                <IconCheck
                  style={{
                    height: rem(18),
                    width: rem(18),
                  }}
                />
              ) : (
                <IconCopy
                  style={{
                    height: rem(18),
                    width: rem(18),
                  }}
                />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
      <DescribeActionIcon resourceType={record.kind} record={record}/>
      <DownloadAction url={record?.status?.downloadURL || undefined}/>
      <DeleteAction resourceType="download-request" record={record} setReload={setReload}/>
    </Group>
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'metadata.name',
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
        id: 'spec.target.kind',
        accessorFn: (row) => row?.spec?.target?.kind ?? '',
        header: 'Target Kind',
      },
      {
        id: 'spec.target.name',
        accessorFn: (row) => row?.spec?.target?.name ?? '',
        header: 'Target Name',
      },
      {
        id: 'status.phase',
        accessorFn: (row) => row?.status?.phase ?? '',
        header: 'Status',
        Cell: ({ row }: any) => (
          <VeleroResourceStatusBadge status={row.original?.status?.phase || undefined}/>
        ),
      },
      {
        id: 'status.expire_in',
        accessorFn: (row) => row?.status?.expire_in ?? '',
        header: 'Expires in',
        Cell: ({ row }) => getExpirationString(row?.original?.status?.expiration),
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
      name='download-requests'
      fetching={fetching}
      items={items || []}
      setReload={setReload}
      columns={columns}
      enablePagination={false}
      showLoading={false}
      initialState={{
        columnVisibility: {
          'status.expire_in': false
        },
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
