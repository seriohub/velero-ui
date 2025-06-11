'use client';

import React, { useEffect, useState } from 'react';

import { useAgentStatus } from '@/contexts/AgentContext';
import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { PodEnvMRT } from '@/components/Features/Settings/PodEnvMRT';

export function API() {
  const agentValues = useAgentStatus();

  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<any>([]);

  useEffect(() => {
    const rows = Object.keys(agentValues.agentConfig).map((key) => ({
      name: key,
      value: agentValues.agentConfig[key],
    }));
    setRowApiConfiguration(rows);
  }, [agentValues.agentConfig]);

  return (
    <MainStack>
      <Toolbar title="Backup" breadcrumbItem={[{ name: 'API' }]}>
        <></>
      </Toolbar>

      <PodEnvMRT
        name="api"
        fetching={false}
        setReload={setReload}
        items={rowApiConfiguration}
      />
    </MainStack>
  );
}
