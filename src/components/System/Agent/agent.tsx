'use client';

import { useEffect } from 'react';

import { ScrollArea, Stack } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { DiagnosticAgentInfoData } from '@/components/Diagnostic/DiagnosticAgentInfoData';
import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

export function Agent() {
  const { reload, setReload } = useDiagnosticAgent();

  const agentValues = useAgentStatus();

  useEffect(() => {}, [reload, agentValues.isAgentAvailable]);

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Agent" breadcrumbItem={{ name: 'Agent Info', href: '/agent' }}>
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>

        <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
          <DiagnosticAgentInfoData />
        </ScrollArea>
      </Stack>
    </>
  );
}
