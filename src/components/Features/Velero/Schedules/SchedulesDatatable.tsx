'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';

import sortBy from 'lodash/sortBy';

import { Anchor, Center, Group, Text } from '@mantine/core';
import { IconClick, IconClock, IconServer } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';

import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { useSchedules } from '@/api/Schedule/useSchedules';

import { MainStack } from '@/components/Commons/MainStack';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';

import DescribeActionIcon from '@/components/Features/Velero/Commons/Actions/DescribeActionIcon';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';

import StartStopActionIcon from '@/components/Features/Velero/Schedules/StartStopActionIcon';
import CreateBackupFromScheduleAction from '@/components/Features/Velero/Schedules/Action/CreateBackupFromScheduleAction';

import EditScheduleAction from '@/components/Features/Velero/Schedules/Action/EditScheduleAction';
import SchedulesHeatmapToolbarIcon from '@/components/Features/Velero/Schedules/SchedulesHeatmap';
import CreateSecheduleAction from '@/components/Features/Velero/Schedules/Action/CreateScheduleAction';

import VeleroResourceStatusBadge from '../Commons/Display/VeleroResourceStatusBadge';
import { useWatchResources } from '@/hooks/useWatchResources';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';

const PAGE_SIZES = [10, 15, 20];

export function SchedulesDatatable() {
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

  /* watch */
  useWatchResources('schedules');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'schedules') {
      setReload((prev) => prev + 1);
    }
  }, 250);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) getSchedules(true);
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) getSchedules();
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data);
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
      <CreateBackupFromScheduleAction record={record} />
      <StartStopActionIcon
        resourceName={record.metadata.name}
        paused={record.spec.paused === true}
        reload={reload}
        setReload={setReload}
      />
      <EditScheduleAction record={record} setReload={setReload} />
      <DeleteAction resourceType="schedule" record={record} setReload={setReload} />
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Schedule" breadcrumbItem={[{ name: 'Schedules' }]}>
        <SchedulesHeatmapToolbarIcon />
        <CreateSecheduleAction setReload={setReload} reload={reload} />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={data?.metadata} />
      <DataTable
        minHeight={160}
        withTableBorder
        borderRadius="sm"
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
        fetching={fetching && records?.length === 0}
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
            title: 'TTL',
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
