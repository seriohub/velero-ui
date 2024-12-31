'use client';

import { ActionIcon, Anchor, Box, Button, CopyButton, Table } from '@mantine/core';

import { IconExternalLink } from '@tabler/icons-react';

import { DiagnosticLink } from './DiagnosticLink';

import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';
import { useServerStatus } from '@/contexts/ServerContext';
import { DiagnosticItemTable } from './DIagnosticItemTable';

export const DiagnosticAgentInfoData = ({
  uiURL,
  apiURL,
  apiArch,
  origins,
  k8sHealth,
  stateManager,
}: any) => {
  //const { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager } = useDiagnosticAgent();

  const serverValues = useServerStatus();

  const elements = [
    <DiagnosticItemTable
      label="Get UI URL"
      value={uiURL !== undefined ? uiURL : ''}
      ok={stateManager.getVariable('getUiURL')}
    />,
    <DiagnosticItemTable
      label="Get API URL"
      value={apiURL !== undefined ? apiURL + '/' : ''}
      ok={stateManager.getVariable('getApiURL')}
      actionIcon={
        <ActionIcon
          component="a"
          href={apiURL + '/'}
          size="sm"
          aria-label="Open in a new tab"
          target="_blank"
        >
          <IconExternalLink size={20} />
        </ActionIcon>
      }
    />,
    <DiagnosticItemTable
      label="API available"
      value=""
      ok={stateManager.getVariable('checkApiReacheable')}
      actionIcon={
        !serverValues.isCurrentServerControlPlane ? <DiagnosticLink ApiURL={apiURL} /> : <></>
      }
    />,
    <DiagnosticItemTable
      label="Get API architecture"
      value={`${apiArch?.payload.arch} ${apiArch?.payload.platform || ''}`}
      ok={stateManager.getVariable('getArchitecture')}
    />,
    <DiagnosticItemTable
      label="Get Origins"
      value={origins ? origins?.join(', ') : ''}
      ok={stateManager.getVariable('getOrigins')}
    />,

    <DiagnosticItemTable
      label="Validate Origins"
      value=""
      ok={stateManager.getVariable('validateOrigins')}
      warning={origins.length > 0 && origins.includes('*')}
      message={origins.length > 0 && origins.includes('*') ? 'Warning: ORIGINS contains "*"' : ''}
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
    />,

    <DiagnosticItemTable
      label="Check Watchdog"
      value=""
      ok={stateManager.getVariable('getWatchdogInfo')}
    />,

    <DiagnosticItemTable
      label="Get cluster data"
      value=""
      ok={stateManager.getVariable('getClusterHealth')}
      message={`Online: ${k8sHealth?.payload?.cluster_online ? 'true' : 'false'}`}
      message2={`Nodes: ${k8sHealth?.payload?.nodes?.total}`}
      message3={`Nodes not ready: ${k8sHealth?.payload?.nodes?.in_error}`}
    />,
    <DiagnosticItemTable
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
    />,
  ];

  return (
    <>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Description</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{elements}</Table.Tbody>
      </Table>

      {/*<List
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
      {/*<DiagnosticItem
          label="Get UI URL"
          value={uiURL !== undefined ? uiURL : ''}
          ok={stateManager.getVariable('getUiURL')}
        />

        {/* API URL */}
      {/*<DiagnosticItem
          label="Get API URL"
          value={apiURL !== undefined ? apiURL + '/' : ''}
          ok={stateManager.getVariable('getApiURL')}
          actionIcon={
            <ActionIcon
              component="a"
              href={apiURL + '/'}
              size="sm"
              aria-label="Open in a new tab"
              target="_blank"
            >
              <IconExternalLink size={20} />
            </ActionIcon>
          }
        />

        {/* API reachable */}
      {/*<DiagnosticItem
          label="API available"
          value=""
          ok={stateManager.getVariable('checkApiReacheable')}
          actionIcon={
            !serverValues.isCurrentServerControlPlane ? <DiagnosticLink ApiURL={apiURL} /> : <></>
          }
        />

        {/* API arch */}
      {/*<DiagnosticItem
          label="Get API architecture"
          value={`${apiArch?.payload.arch} ${apiArch?.payload.platform || ''}`}
          ok={stateManager.getVariable('getArchitecture')}
        />

        {/* Origins */}
      {/*<DiagnosticItem
          label="Get Origins"
          value={origins ? origins?.join(', ') : ''}
          ok={stateManager.getVariable('getOrigins')}
        />

        {/* Validate Origins */}
      {/*{!serverValues.isCurrentServerControlPlane && (
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
        )}
        {/* Watchdog */}
      {/*<DiagnosticItem
          label="Check Watchdog"
          value=""
          ok={stateManager.getVariable('getWatchdogInfo')}
        />

        {/* Cluster Online */}
      {/*<DiagnosticItem
          label="Get cluster data"
          value=""
          ok={stateManager.getVariable('getClusterHealth')}
          message={`Online: ${k8sHealth?.payload?.cluster_online ? 'true' : 'false'}`}
          message2={`Nodes: ${k8sHealth?.payload?.nodes?.total}`}
          message3={`Nodes not ready: ${k8sHealth?.payload?.nodes?.in_error}`}
        />

        {/* Components compatibility */}
      {/*<DiagnosticItem
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
      </List>*/}
      <Box mt={30}>
        <CopyButton value={stateManager.generateMarkdownReport()}>
          {({ copied, copy }) => (
            <Button color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'} onClick={copy}>
              {copied ? 'Copied!' : 'Copy diagnostic report to clipboard'}
            </Button>
          )}
        </CopyButton>
      </Box>
    </>
  );
};
