'use client';

import { useEffect, useState } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Center, Group, Stack } from '@mantine/core';

import RefreshDatatable from '../../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../../Toolbar';
import { IconClick } from '@tabler/icons-react';
import CreateSCMappingIcon from '../../Actions/ToolbarActionIcons/CreateSCMappingIcon';
import EditSCMapping from '../../Actions/DatatableActionsIcons/EditSCMapping';
import DeleteSCMappingActionIcon from '../../Actions/DatatableActionsIcons/DeleteSCMappingActionIcon';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { DataFetchedInfo } from '../../DataFetchedInfo';
import { useK8sConfigMap } from '@/api/Kubernetes/useK8sConfigMap';

export function SCMappingData() {
  const { data: configMap, getConfigMap, fetching } = useK8sConfigMap();
  const [items, setItems] = useState<any>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 790 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload>1)
      getConfigMap(true);
  }, [reload]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 790 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable)
      getConfigMap();
  }, [agentValues.isAgentAvailable]);


  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 885 has been called`, `color: green; font-weight: bold;`);
    if (configMap?.payload !== undefined) {
      setItems(configMap.payload);
    }
  }, [configMap]);

  const renderActions: DataTableColumn<any>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <EditSCMapping record={record} reload={reload} setReload={setReload} />
      <DeleteSCMappingActionIcon record={record} reload={reload} setReload={setReload} />
    </Group>
  );

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Storage Class Mapping" breadcrumbItem={{name:'Storage Class Mapping', href:'/sc-mapping'}}>
          <CreateSCMappingIcon setReload={setReload} reload={reload} />
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>
        <DataFetchedInfo metadata={configMap?.metadata} />
        <DataTable
          minHeight={160}
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={items}
          idAccessor="id"
          totalRecords={items.length}
          fetching={fetching}
          columns={[
            {
              accessor: 'id',
              title: 'Number',
              width: 105,
            },
            {
              accessor: 'oldStorageClass',
              title: 'Old Storage Class',
            },
            {
              accessor: 'newStorageClass',
              title: 'New Storage Class',
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
      </Stack>
    </>
  );
}
