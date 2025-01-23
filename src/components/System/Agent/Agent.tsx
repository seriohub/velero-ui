'use client';

import { useEffect } from 'react';

import { ScrollArea } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { DiagnosticAgentInfoData } from '@/components/Diagnostic/DiagnosticAgentInfoData';
import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';
import { MainStack } from '@/components/Velero/MainStack';

export function Agent() {
  // const { reload, setReload } = useDiagnosticAgent();
  const { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager, reload, setReload } =
    useDiagnosticAgent();

  const agentValues = useAgentStatus();

  useEffect(() => {}, [reload, agentValues.isAgentAvailable]);

  return (
    <MainStack>
      <Toolbar title="Agent" breadcrumbItem={[{ name: 'Agent Info' }]}>
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>

      <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
        <DiagnosticAgentInfoData
          uiURL={uiURL}
          apiURL={apiURL}
          apiArch={apiArch}
          origins={origins}
          k8sHealth={k8sHealth}
          stateManager={stateManager}
        />
      </ScrollArea>
    </MainStack>
  );
}
