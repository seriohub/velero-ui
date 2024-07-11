import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  List,
  Modal,
  Text,
  ThemeIcon,
  rem,
} from '@mantine/core';

import {
  IconCheck,
  IconCircleCheck,
  IconExternalLink,
  IconPlugConnected,
  IconRefresh,
} from '@tabler/icons-react';

import { DiagnosticLink } from './DiagnosticLink';

import { DiagnosticItem } from './DIagnosticItem';

import { useDisclosure } from '@mantine/hooks';

import { useDiagnosticAgent } from '@/hooks/useDiagnosticAgent';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { IconPlugConnectedX } from '@tabler/icons-react';

export const DiagnosticAgentInfo = () => {
  const { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager, reload, setReload } =
    useDiagnosticAgent();

  const [opened, { open, close }] = useDisclosure(false);

  const agentValues = useAgentStatus();

  return (
    <>
      <Group gap={2}>
        {!agentValues.isAgentAvailable && <IconPlugConnectedX size={20} color="red" />}
        {agentValues.isAgentAvailable && <IconPlugConnected size={20} color="green" />}
        <Text size="sm" mr={5}>
          Agent:
        </Text>
        <Text size="sm" mr={5} c="blue">
          {agentValues?.currentAgent?.name}
        </Text>
        <Button onClick={open} variant="default" size="compact-xs">
          {stateManager.allTrue && !stateManager.hasWarnings && (
            <>
              <Group gap={0}>
                <IconCheck color="green" />{' '}
                <Text size="sm" c="green">
                  All Check Passed
                </Text>
              </Group>
            </>
          )}
          {stateManager.allTrue && stateManager.hasWarnings && (
            <>
              <Group gap={0}>
                <IconCheck color="orange" />{' '}
                <Text c="orange" size="sm">
                  Check warning
                </Text>
              </Group>
            </>
          )}
          {!stateManager.allTrue && (
            <>
              <Group gap={0}>
                <IconCheck color="red" size={20} />
                <Text c="red" size="sm">
                  Error
                </Text>
              </Group>
            </>
          )}
        </Button>

        <ActionIcon
          variant="subtle"
          size="compact-xs"
          aria-label="Settings"
          onClick={() => {
            setReload(reload + 1);
          }}
        >
          <IconRefresh size={16} stroke={1.5} />
        </ActionIcon>
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

        <Box>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="dimmed" size={24} radius="xl">
                <IconCircleCheck color="green" style={{ width: rem(24), height: rem(24) }} />
              </ThemeIcon>
            }
          >
            {/* UI URL*/}
            <DiagnosticItem
              label="Get UI URL"
              value={uiURL !== undefined ? uiURL : ''}
              ok={stateManager.getVariable('getUiURL')}
            />

            {/* API URL */}
            <DiagnosticItem
              label="Get API URL"
              value={apiURL !== undefined ? apiURL : ''}
              ok={stateManager.getVariable('getApiURL')}
              actionIcon={
                <ActionIcon
                  component="a"
                  href={apiURL}
                  size="sm"
                  aria-label="Open in a new tab"
                  target="_blank"
                >
                  <IconExternalLink size={20} />
                </ActionIcon>
              }
            />

            {/* API reachable */}
            <DiagnosticItem
              label="Check API reachable"
              value=""
              ok={stateManager.getVariable('checkApiReacheable')}
              actionIcon={<DiagnosticLink ApiURL={apiURL} />}
            />

            {/* API arch */}
            <DiagnosticItem
              label="Get API architecture"
              value={`${apiArch?.payload.arch} ${apiArch?.payload.platform || ''}`}
              ok={stateManager.getVariable('getArchitecture')}
            />

            {/* Origins */}
            <DiagnosticItem
              label="Get Origins"
              value={origins ? origins?.join(', ') : ''}
              ok={stateManager.getVariable('getOrigins')}
            />

            {/* Validate Origins */}
            <DiagnosticItem
              label="Validate Origins"
              value=""
              ok={stateManager.getVariable('validateOrigins')}
              warning={origins.length > 0 && origins.includes('*')}
              message={
                origins.length > 0 && origins.includes('*') ? 'Warning: ORIGINS contains "*"' : ''
              }
              message2={
                origins.length == 0 || (origins.length > 0 && !origins.includes(uiURL))
                  ? `Error: Origins must contain ${uiURL}`
                  : ''
              }
              message3={
                !origins.includes('*') && origins.length > 0 && !origins.includes(uiURL)
                  ? "If you have problems you can try to use '*'"
                  : ''
              }
            />

            {/* Watchdog */}
            <DiagnosticItem
              label="Check Watchdog"
              value=""
              ok={stateManager.getVariable('getWatchdogInfo')}
            />

            {/* Cluster Online */}
            <DiagnosticItem
              label="Get cluster data"
              value=""
              ok={stateManager.getVariable('getClusterHealth')}
              message={`Online: ${k8sHealth?.payload?.cluster_online ? 'true' : 'false'}`}
              message2={`Nodes: ${k8sHealth?.payload?.nodes?.total}`}
              message3={`Nodes not ready: ${k8sHealth?.payload?.nodes?.in_error}`}
            />

            {/* Components compatibility */}
            <DiagnosticItem
              label="UI/API Check Compatibility"
              value=""
              ok={stateManager.getVariable('getUiApiVerCompatibility')}
              message={
                stateManager.getVariable('getUiApiVerCompatibility')
                  ? ''
                  : 'UI/API versions not shown in the compatibility list. You can proceed, but errors may occur.'
              }
              message4={
                stateManager.getVariable('getUiApiVerCompatibility') ? (
                  <></>
                ) : (
                  <>
                    <Anchor
                      href="https://github.com/seriohub/velero-helm/blob/main/components.txt"
                      target="_blank"
                      size="sm"
                    >
                      see compatibility list for details
                    </Anchor>
                  </>
                )
              }
            />
          </List>
        </Box>
      </Modal>
    </>
  );
};
