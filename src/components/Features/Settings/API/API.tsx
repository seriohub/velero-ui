'use client';

import React, { useEffect, useState } from 'react';

import { DataTable } from 'mantine-datatable';
import { useAgentStatus } from '@/contexts/AgentContext';

import { MainStack } from '@/components/Commons/MainStack';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

export function API() {
  const agentValues = useAgentStatus();

  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<any>([]);

  useEffect(() => {
    if (agentValues.agentConfig !== undefined) {
      const rows = Object.keys(agentValues.agentConfig).map((key) => ({
        key,
        value: agentValues.agentConfig[key],
      }));
      setRowApiConfiguration(rows);
    }
  }, [agentValues.agentConfig]);

  return (
    <MainStack>
      <Toolbar title="Backup" breadcrumbItem={[{ name: 'API' }]}>
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>

      <DataTable
        idAccessor="key"
        withTableBorder
        striped
        columns={[
          {
            accessor: 'key',
            title: 'Environment variable',
            width: 150,
          },
          {
            accessor: 'value',
            title: 'value',
            render: ({ key }: any) => <>{agentValues.agentConfig[key]}</>,
            sortable: true,
            width: 600,
            ellipsis: true,
          },
        ]}
        records={rowApiConfiguration}
      />
    </MainStack>
  );
}
