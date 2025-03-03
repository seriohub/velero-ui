'use client';

import React, { useEffect } from 'react';

import { Button, CopyButton } from '@mantine/core';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { DiagnosticAgentInfoData } from '@/components/Features/Diagnostic/DiagnosticAgentInfoData';

export function Agent() {
  const { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager, reload, setReload } =
    useDiagnosticAgent();

  const agentValues = useAgentStatus();

  useEffect(() => {}, [reload, agentValues.isAgentAvailable]);

  return (
    <MainStack>
      <Toolbar title="Agent" breadcrumbItem={[{ name: 'Agent Info' }]}>
        <ReloadData setReload={setReload} reload={reload} />
        <CopyButton value={stateManager.generateMarkdownReport()}>
          {({ copied, copy }) => (
            <Button color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'} onClick={copy}>
              {copied ? 'Copied!' : 'Copy Diagnostic Report to Clipboard'}
            </Button>
          )}
        </CopyButton>
      </Toolbar>

      <DiagnosticAgentInfoData
        uiURL={uiURL}
        apiURL={apiURL}
        apiArch={apiArch}
        origins={origins}
        k8sHealth={k8sHealth}
        stateManager={stateManager}
      />
    </MainStack>
  );
}
