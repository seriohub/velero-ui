'use client';

import React, { useEffect, useState } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';

import { MainStack } from '@/components/Commons/MainStack';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { useVeleroPods } from "@/api/Velero/useVeleroPods";
import VeleroResourceStatusBadge from "@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge";
import { Center, Group } from "@mantine/core";

import { IconClick } from "@tabler/icons-react";
import PodLogsActionIcon from "@/components/Features/Settings/Velero/Actions/PodLogsActionIcon";

export function Velero() {

  const {
    data,
    getVeleroPods,
    fetching
  } = useVeleroPods();

  const [reload, setReload] = useState(1);
  const [rowLogs, setRowLogs] = useState<any>([]);

  useEffect(() => {
    getVeleroPods()
  }, [reload]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRowLogs(data);
    }
  }, [data]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <PodLogsActionIcon podName={record?.podName}/>
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Velero" breadcrumbItem={[{ name: 'Velero' }]}>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>

      <DataTable
        idAccessor="podName"
        withTableBorder
        striped
        columns={[
          {
            accessor: 'type',
            title: 'Type',
          },
          {
            accessor: 'version',
            title: 'Version',
          },
          {
            accessor: 'podName',
            title: 'Pod Name',
          },
          {
            accessor: 'nodeName',
            title: 'Node Name',
          },
          {
            accessor: 'status',
            title: 'Status',
            render: ({ status }: any) => (
              <VeleroResourceStatusBadge status={status}/>
            )

          },
          {
            accessor: 'restarts',
            title: 'Restarts',
          },
          {
            accessor: 'created',
            title: 'Created',
          },
          {
            accessor: 'ip',
            title: 'Ip',
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
        records={rowLogs}
      />
    </MainStack>
  );
}
