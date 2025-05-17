'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Center, Group } from '@mantine/core';

import { IconClick } from '@tabler/icons-react';

import { MainStack } from '@/components/Commons/MainStack';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';

import { useInspectBackups } from '@/api/Inspect/useInspectBackups';
import InspectAction from '@/components/Features/Velero/Inspect/Actions/InspectAction';

export function InspectDatatable() {
  const {
    data,
    getInspectBackups,
    fetching
  } = useInspectBackups();
  const [items, setItems] = useState<any>([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    getInspectBackups();
  }, [reload]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <InspectAction record={record}/>
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Inspect Backups" breadcrumbItem={[{ name: 'Inspect Datatable' }]}>
        {/*<CreateSCMappingIcon setReload={setReload} reload={reload} />*/}
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>

      <DataTable
        minHeight={160}
        maw={600}
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        records={items}
        idAccessor="name"
        totalRecords={items.length}
        fetching={fetching}
        columns={[
          {
            accessor: 'name',
            title: 'Backups available',
            width: 600,
          },
          {
            accessor: 'actions',
            title: (
              <Center>
                <IconClick size={16}/>
              </Center>
            ),
            width: '100',
            render: renderActions,
          },
        ]}
      />
    </MainStack>
  );
}
