'use client';

import { useMemo } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Anchor, Center, Group, MultiSelect, Text, TextInput } from '@mantine/core';

import { IconClick, IconDeviceFloppy, IconSearch, IconServer, IconX } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';

const PAGE_SIZES = [10, 15, 20];

export function PVBDatatableView({
                                   records,
                                   dataFiltered,
                                   pageSize,
                                   page,
                                   setPage,
                                   setPageSize,
                                   sortStatus,
                                   setSortStatus,
                                   fetching,

                                   items,
                                   setSelectedPhase,
                                   selectedPhase,
                                   queryName,
                                   setQueryName,
                                 }: any) {
  const router = useRouter();

  // get schedule status list
  const phase = useMemo(() => {
    const schedule_list = Array.from(new Set<string>(items.map((e: any) => e?.status?.phase)));
    return [...schedule_list];
  }, [items]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="center" wrap="nowrap">
      <DescribeActionIcon resourceType="PodVolumeBackup" record={record}/>
    </Group>
  );

  return (
    <DataTable
      minHeight={160}
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      records={records}
      idAccessor="metadata.name"
      totalRecords={dataFiltered.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={fetching}
      pinLastColumn
      columns={[
        {
          accessor: 'metadata.name',
          title: 'Name',
          sortable: true,
          //width: 400,
          ellipsis: true,
          filter: (
            <TextInput
              label="Name"
              description="Show pod volumes backup whose names include the specified text"
              placeholder="Search name..."
              leftSection={<IconSearch size={16}/>}
              rightSection={
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  c="dimmed"
                  onClick={() => setQueryName('')}
                >
                  <IconX size={14}/>
                </ActionIcon>
              }
              value={queryName}
              onChange={(e) => setQueryName(e.currentTarget.value)}
            />
          ),
          filtering: queryName !== '',
          render: (record) => (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/pod-volume-backups/${record?.metadata?.name}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16}/>
                <Text>{record?.metadata?.name}</Text>
              </Group>
            </Anchor>
          ),
        },
        {
          accessor: 'spec.tags.backup',
          ellipsis: true,
          title: 'Backup',
          sortable: true,
          render: ({ spec }: any) => (
            <>
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backups/${spec.tags.backup}`);
                }}
              >
                <Group gap={5}>
                  <IconDeviceFloppy size={16}/>
                  <Text>{spec.tags.backup}</Text>
                </Group>
              </Anchor>
            </>
          ),
        },
        {
          accessor: 'status.phase',
          title: 'Status',
          sortable: true,
          filter: (
            <MultiSelect
              label="Phase"
              description="Show all backups of the selected schedule"
              data={phase}
              value={selectedPhase}
              placeholder="Search schedule…"
              onChange={setSelectedPhase}
              leftSection={<IconSearch size={16}/>}
              clearable
              searchable
            />
          ),
          filtering: selectedPhase.length > 0,
          ellipsis: true,
          render: ({ status }: any) => (
            <VeleroResourceStatusBadge status={status?.phase || undefined}/>
          ),
        },
        {
          accessor: 'spec.tags.pod',
          title: 'Pod Name',
          sortable: true,
          ellipsis: true,
        },
        {
          accessor: 'spec.tags.volume',
          title: 'Volume',
          sortable: true,
          ellipsis: true,
        },

        {
          accessor: 'spec.backupStorageLocation',

          title: 'Storage Location',
          sortable: true,
          ellipsis: true,
          render: ({ spec }: any) => (
            <>
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${spec?.backupStorageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16}/>
                  <Text>{spec?.backupStorageLocation && spec.backupStorageLocation}</Text>
                </Group>
              </Anchor>
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
          //width: '0%',
          render: renderActions,
        },
      ]}
    />
  );
}
