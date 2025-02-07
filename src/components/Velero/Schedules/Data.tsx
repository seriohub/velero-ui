'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { Anchor, Center, Group, Text } from '@mantine/core';
import { IconClick, IconClock, IconServer } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import DescribeActionIcon from '@/components/Actions/DatatableActionsIcons/DescribeActionIcon';
import DeleteActionIcon from '@/components/Actions/DatatableActionsIcons/DeleteActionIcon';
import StartStopActionIcon from '../../Actions/DatatableActionsIcons/StartStopActionIcon';
import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import CreateBackupFromScheduleActionIcon from '../../Actions/DatatableActionsIcons/CreateBackupFromScheduleActionIcon';
import CreateSecheduleToolbarIcon from '../../Actions/ToolbarActionIcons/CreateScheduleToolbarIcon';
import EditScheduleActionIcon from '../../Actions/DatatableActionsIcons/EditScheduleActionIcon';
import Toolbar from '../../Toolbar';
import SchedulesHeatmapToolbarIcon from '../../Actions/ToolbarActionIcons/SchedulesHeatmap';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useSchedules } from '@/api/Schedule/useSchedules';
import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';
import { MainStack } from '@/components/Velero/MainStack';

const PAGE_SIZES = [10, 15, 20];

export function ScheduleData() {
  const router = useRouter();
  const { data, getSchedules, fetching } = useSchedules();
  const agentValues = useAgentStatus();
  const [items = [], setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState(items.slice(0, pageSize));

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) getSchedules(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getSchedules();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data.payload);
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
      <DescribeActionIcon resourceType="schedule" record={record} />
      <CreateBackupFromScheduleActionIcon record={record} />
      <StartStopActionIcon
        resourceName={record.metadata.name}
        paused={record.spec.paused === true}
        reload={reload}
        setReload={setReload}
      />
      <EditScheduleActionIcon record={record} reload={reload} setReload={setReload} />
      <DeleteActionIcon
        resourceType="schedule"
        record={record}
        reload={reload}
        setReload={setReload}
      />
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Schedule" breadcrumbItem={[{ name: 'Schedules' }]}>
        <SchedulesHeatmapToolbarIcon />
        <CreateSecheduleToolbarIcon setReload={setReload} reload={reload} />
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />
      <DataTable
        minHeight={160}
        withTableBorder
        borderRadius="sm"
        // withColumnBorders
        striped
        highlightOnHover
        records={records}
        idAccessor="metadata.name"
        totalRecords={items.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={fetching}
        columns={[
          {
            accessor: 'metadata.name',
            title: 'Name',
            sortable: true,
            render: (record: any) => (
              <Anchor
                size="sm"
                onClick={() => {
                  // console.log(record);
                  router.push(`/schedules/${record?.metadata?.name}`);
                }}
              >
                <Group gap={5}>
                  <IconClock size={16} />
                  <Text>{record?.metadata?.name}</Text>
                </Group>
              </Anchor>
            ),
          },
          {
            accessor: 'spec.schedule',
            title: 'Schedules',
          },
          {
            accessor: 'status.lastBackup',
            title: 'Last Backups',
            sortable: true,
          },
          {
            accessor: 'spec.template.ttl',
            title: 'Backups TTL',
          },
          {
            accessor: 'spec.template.storageLocation',
            title: 'Storage Location',
            sortable: true,
            render: ({ spec }: any) => (
              <>
                <Anchor
                  size="sm"
                  onClick={() => {
                    // console.log(record);
                    router.push(`/backup-storage-locations/${spec.template.storageLocation}`);
                  }}
                >
                  <Group gap={5}>
                    <IconServer size={16} />
                    <Text>{spec.template.storageLocation}</Text>
                  </Group>
                </Anchor>
              </>
            ),
          },
          {
            accessor: '.spec.template.defaultVolumesToFsBackup',
            title: 'File-system backup',
            render: (record: any) => {
              if (record.spec.template.defaultVolumesToFsBackup === true) {
                return <VeleroResourceStatusBadge status="true" />;
              }
              return <VeleroResourceStatusBadge status="false" />;
            },
          },

          {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: (record: any) => (
              <VeleroResourceStatusBadge
                status={record.spec.paused === true ? 'Paused' : 'Running'}
              />
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
    </MainStack>
  );
}
