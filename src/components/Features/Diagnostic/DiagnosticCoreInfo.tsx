import { ActionIcon, Box, Button, Group, List, Modal, Text, ThemeIcon, rem, Tooltip } from '@mantine/core';

import {
  IconCheck,
  IconCircleCheck,
  IconExternalLink, IconInfoSmall, IconInfoSquare,
  IconPlugConnected,
  IconPlugConnectedX,
  IconRefresh, IconServer,
} from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

import { useServerStatus } from '@/contexts/ServerContext';
import { useDiagnosticCore } from '@/hooks/diagnostic/useDiagnosticCore';

import { DiagnosticLink } from './DiagnosticLink';
import { DiagnosticItem } from './DIagnosticItem';
import { DiagnosticInfoData } from "@/components/Features/Diagnostic/DiagnosticInfoData";

export const DiagnosticCoreInfo = () => {
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
    useDiagnosticCore();

  const [opened, {
    open,
    close
  }] = useDisclosure(false);
  const serverValues = useServerStatus();
  return (
    <>
      <Group gap={2}>
        <Tooltip label="Vui Control Plane">
          <Group gap={0}>
            {!serverValues.isServerAvailable && <IconServer size={20} color="red"/>}
            {serverValues.isServerAvailable && <IconServer size={20} color="green"/>}
            <Text size="sm" fw={600}>
              {serverValues?.currentServer?.name}
            </Text>
          </Group>
        </Tooltip>

        {stateManager.allTrue && !stateManager.hasWarnings && (
          <Tooltip label="Control Plane Check Passed!">
            <IconCheck color="green"/>
          </Tooltip>
        )}

        {stateManager.allTrue && stateManager.hasWarnings && (
          <Group gap={0}>
            <IconCheck color="orange"/>
            <Text c="orange" size="sm">
              Check warning
            </Text>
          </Group>
        )}

        {!stateManager.allTrue && (
          <Group gap={0}>
            <IconCheck color="red" size={20}/>
            <Text c="red" size="sm">
              Error
            </Text>
          </Group>
        )}

        <Tooltip label="Refresh control plane connection data">
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

        <Tooltip label="Control plane info">
          <ActionIcon
            size={20}
            variant="transparent"
            onClick={open}
          >
            <IconInfoSquare size={20} stroke={1.5}/>
          </ActionIcon>
        </Tooltip>
      </Group>

      {/*<Modal
        opened={opened}
        onClose={close}
        title="Core diagnostic"
        centered
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >


        <Box>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="dimmed" size={24} radius="xl">
                <IconCircleCheck
                  color="green"
                  style={{
                    width: rem(24),
                    height: rem(24),
                  }}
                />
              </ThemeIcon>
            }
          >

            <DiagnosticItem
              label="Get UI URL"
              value={uiURL !== undefined ? uiURL : ''}
              ok={stateManager.getVariable('getUiURL')}
            />


            <DiagnosticItem
              label="Get API URL"
              value={apiURL !== undefined ? `${apiURL}/` : ''}
              ok={stateManager.getVariable('getApiURL')}
              actionIcon={
                <ActionIcon
                  variant="outline"
                  component="a"
                  href={apiURL}
                  size="sm"
                  aria-label="Open in a new tab"
                  target="_blank"
                >
                  <IconExternalLink size={20}/>
                </ActionIcon>
              }
            />


            <DiagnosticItem
              label="Check API reachable"
              value=""
              ok={stateManager.getVariable('checkApiReacheable')}
              actionIcon={<DiagnosticLink ApiURL={apiURL}/>}
            />


            <DiagnosticItem
              label="Get API architecture"
              value={`${apiArch?.arch} ${apiArch?.platform || ''}`}
              ok={stateManager.getVariable('getArchitecture')}
            />


            <DiagnosticItem
              label="Get Origins"
              value={origins ? origins?.join(', ') : ''}
              ok={stateManager.getVariable('getOrigins')}
            />


            <DiagnosticItem
              label="Validate Origins"
              value=""
              ok={stateManager.getVariable('validateOrigins')}
              warning={origins.length > 0 && origins.includes('*')}
              message={
                origins.length > 0 && origins.includes('*') ? 'Warning: ORIGINS contains "*"' : ''
              }
              message2={
                origins.length === 0 || (origins.length > 0 && !origins.includes(uiURL))
                  ? `Error: Origins must contain ${uiURL}`
                  : ''
              }
              message3={
                !origins.includes('*') && origins.length > 0 && !origins.includes(uiURL)
                  ? "If you have problems you can try to use '*'"
                  : ''
              }
            />


            <DiagnosticItem
              label="Get cluster data"
              value=""
              ok={stateManager.getVariable('getClusterHealth')}
              message={`Online: ${k8sHealth?.cluster_online ? 'true' : 'false'}`}
              message2={`Nodes: ${k8sHealth?.nodes?.total}`}
              message3={`Nodes not ready: ${k8sHealth?.nodes?.in_error}`}
            />
          </List>
        </Box>
      </Modal>*/}
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
