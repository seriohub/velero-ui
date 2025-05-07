'use client';

import { ActionIcon, Group, Modal, Text, Tooltip } from '@mantine/core';

import { IconCheck, IconPlugConnected, IconRefresh, IconPlugConnectedX, IconInfoSquare } from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

import { DiagnosticInfoData } from './DiagnosticInfoData';

export const DiagnosticAgentInfo = () => {
  const {
    uiURL,
    apiURL,
    apiArch,
    origins,
    k8sHealth,
    stateManager,
    reload,
    setReload
  } =
    useDiagnosticAgent();

  const [opened, {
    open,
    close
  }] = useDisclosure(false);

  const agentValues = useAgentStatus();

  return (
    <>
      <Group gap={2}>
        <Tooltip label="Vui Cluster Agent">
          <Group gap={0}>
            {!agentValues.isAgentAvailable && (
              <IconPlugConnectedX color="red" size={16}/>
            )}
            {agentValues.isAgentAvailable && (
              <IconPlugConnected color="green" size={16}/>
            )}
            <Text size="sm" fw={600}>
              {agentValues?.currentAgent?.name}
            </Text>
          </Group>
        </Tooltip>

        {stateManager.allTrue && !stateManager.hasWarnings && (
          <Tooltip label="Agent Check Passed!">
            <IconCheck color="green"/>
          </Tooltip>
        )}
        {stateManager.allTrue && stateManager.hasWarnings && (
          <>
            <Group gap={0}>
              <IconCheck color="orange" size={20}/>
              <Text c="orange" size="sm">
                Check warning
              </Text>
            </Group>
          </>
        )}
        {!stateManager.allTrue && (
          <>
            <Group gap={0}>
              <IconCheck color="red" size={20}/>
              <Text c="red" size="sm">
                Error
              </Text>
            </Group>
          </>
        )}

        <Tooltip label="Refresh agent connection data">
          <ActionIcon
            size={20}
            variant="transparent"
            aria-label="Settings"
            onClick={() => {
              setReload(reload + 1);
            }}
          >
            <IconRefresh size={20} stroke={1.5}/>
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Agent info">
          <ActionIcon
            size={20}
            variant="transparent"
            onClick={open}
          >
            <IconInfoSquare size={20} stroke={1.5}/>
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title="Agent diagnostic"
        centered
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {/* Modal content */}

        <DiagnosticInfoData
          uiURL={uiURL}
          apiURL={apiURL}
          apiArch={apiArch}
          origins={origins}
          k8sHealth={k8sHealth}
          stateManager={stateManager}
        />
      </Modal>
    </>
  );
};
