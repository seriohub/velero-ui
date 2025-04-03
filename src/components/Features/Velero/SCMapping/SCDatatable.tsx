'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Center, Group } from '@mantine/core';

import { IconClick } from '@tabler/icons-react';

import { useStorageClassesMap } from '@/api/SCMapping/useStorageClassesMap';

import { useAgentStatus } from '@/contexts/AgentContext';

import { MainStack } from '@/components/Commons/MainStack';
import ReloadData from '@/components/Inputs/ReloadData';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import CreateSCMappingIcon from '@/components/Features/Velero/SCMapping/CreateSCMappingIcon';
import EditSCMapping from '@/components/Features/Velero/SCMapping/EditSCMapping';
import DeleteSCMappingActionIcon from '@/components/Features/Velero/SCMapping/DeleteSCMappingActionIcon';

export function SCDatatable() {
  const { data: configMap, getStorageClassesMap, fetching } = useStorageClassesMap();
  const [items, setItems] = useState<any>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) {
      getStorageClassesMap(true);
    }
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getStorageClassesMap();
    }
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (configMap !== undefined) {
      setItems(configMap);
    }
  }, [configMap]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <EditSCMapping record={record} reload={reload} setReload={setReload} />
      <DeleteSCMappingActionIcon record={record} reload={reload} setReload={setReload} />
    </Group>
  );

  return (
    <MainStack>
      <Toolbar title="Storage Class Mapping" breadcrumbItem={[{ name: 'Storage Class Mapping' }]}>
        <CreateSCMappingIcon setReload={setReload} reload={reload} />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <DataFetchedInfo metadata={configMap?.metadata} />
      <DataTable
        minHeight={160}
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        records={items}
        idAccessor="oldStorageClass"
        totalRecords={items.length}
        fetching={fetching}
        columns={[
          {
            accessor: 'oldStorageClass',
            title: 'Storage class used in backup',
          },
          {
            accessor: 'newStorageClass',
            title: 'New Storage Class to be used for restore',
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
