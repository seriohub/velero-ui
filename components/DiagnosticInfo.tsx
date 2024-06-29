import { useEffect, useState, useContext } from 'react';

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
import { useApiGet } from '@/hooks/useApiGet';
import { IconCheck, IconCircleCheck, IconExternalLink } from '@tabler/icons-react';

import { env } from 'next-runtime-env';
import { useUrlAvailability } from '@/hooks/checkUrlAvailability';
import { DiagnosticLink } from './DiagnosticLink';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { DiagnosticItem } from './Diagnostic/DIagnosticItem';

import { StateManager } from '@/components/Diagnostic/DiagnosticState';

import { useDisclosure } from '@mantine/hooks';

export const DiagnosticInfo = () => {
  const appValues = useContext(VeleroAppContexts);

  const stateManager = new StateManager();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: ApiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: ApiArch, getData: getApiArch } = useApiGet();
  const { data: watchdog, getData: getWatchdog } = useApiGet();
  const { data: compatibility, getData: getCompatibility } = useApiGet();

  const [UiURL, setUiHost] = useState('');

  const ApiURL = appValues.state.currentBackend?.url;

  const [origins, setOrigins] = useState<string | any>('');

  const { isUrlAvailable, loading, checkAvailability } = useUrlAvailability();

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    getDataK8sHealth('/info/health-k8s');
    getApiOrigins('/info/origins');
    getApiArch('/info/arch');
    getWatchdog('/info/watchdog');
    getCompatibility('/info/get-ui-comp', 'version=' + NEXT_PUBLIC_FRONT_END_BUILD_VERSION);

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(currentURL.protocol + '//' + currentURL.host);
    }
  }, [appValues.state.currentBackend]);

  useEffect(() => {
    if (ApiURL !== undefined) checkAvailability(ApiURL + '/info/health');
  }, [ApiURL]);

  useEffect(() => {
    if (ApiOrigins !== undefined) {
      setOrigins(ApiOrigins.payload);
    }
  }, [ApiOrigins]);

  stateManager.setVariable('UiURL', UiURL != '');
  stateManager.setVariable('ApiURL', ApiURL != '');
  stateManager.setVariable('APIReacheable', isUrlAvailable);
  stateManager.setVariable(
    'GetArchitecture',
    isUrlAvailable && ApiArch?.payload?.platform == undefined
  );
  stateManager.setVariable('GetOrigins', origins.length > 0);
  stateManager.setVariable(
    'ValidateOrigins',
    origins.length > 0 && (origins.includes(UiURL) || origins.includes('*'))
  );
  stateManager.setVariable('Watchdog', watchdog && watchdog?.payload !== undefined ? true : false);
  stateManager.setVariable('Cluster', k8sHealth != undefined);
  stateManager.hasWarnings = origins.length > 0 && origins.includes('*');
  stateManager.setVariable('Compatibility', compatibility?.payload?.compatibility);

  // console.log(stateManager);
  return (
    <>
      <Box>
        <Button onClick={open} variant="default" size="compact-xs">
          {stateManager.allTrue && !stateManager.hasWarnings && (
            <>
              <Group gap={0}>
                <IconCheck color="green" />{' '}
                <Text size="sm" color="green">
                  All Check Passed
                </Text>
              </Group>
            </>
          )}
          {stateManager.allTrue && stateManager.hasWarnings && (
            <>
              <Group gap={0}>
                <IconCheck color="orange" /> <Text size="sm">Check warning</Text>
              </Group>
            </>
          )}
          {!stateManager.allTrue && (
            <>
              <Group gap={0}>
                <IconCheck color="red" />
                <Text size="sm">Error</Text>
              </Group>
            </>
          )}
        </Button>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Diagnostic"
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
              value={UiURL !== undefined ? UiURL : ''}
              ok={stateManager.getVariable('UiURL')}
            />

            {/* API URL */}
            <DiagnosticItem
              label="Get API URL"
              value={ApiURL !== undefined ? ApiURL : ''}
              ok={stateManager.getVariable('ApiURL')}
              actionIcon={
                <ActionIcon
                  component="a"
                  href={ApiURL}
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
              ok={stateManager.getVariable('APIReacheable')}
              actionIcon={<DiagnosticLink ApiURL={ApiURL} />}
            />

            {/* API arch */}
            <DiagnosticItem
              label="Get API architecture"
              value={`${ApiArch?.payload.arch} ${ApiArch?.payload.platform || ''}`}
              ok={stateManager.getVariable('GetArchitecture')}
            />

            {/* Origins */}
            <DiagnosticItem
              label="Get Origins"
              value={origins ? origins?.join(', ') : ''}
              ok={stateManager.getVariable('GetOrigins')}
            />

            {/* Validate Origins */}
            <DiagnosticItem
              label="Validate Origins"
              value=""
              ok={stateManager.getVariable('ValidateOrigins')}
              warning={origins.length > 0 && origins.includes('*')}
              message={
                origins.length > 0 && origins.includes('*') ? 'Warning: ORIGINS contains "*"' : ''
              }
              message2={
                origins.length == 0 || (origins.length > 0 && !origins.includes(UiURL))
                  ? `Error: Origins must contain ${UiURL}`
                  : ''
              }
              message3={
                !origins.includes('*') && origins.length > 0 && !origins.includes(UiURL)
                  ? "If you have problems you can try to use '*'"
                  : ''
              }
            />

            {/* Watchdog */}
            <DiagnosticItem
              label="Check Watchdog"
              value=""
              ok={stateManager.getVariable('Watchdog')}
            />

            {/* Cluster Online */}
            <DiagnosticItem
              label="Get cluster data"
              value=""
              ok={stateManager.getVariable('Cluster')}
              message={`Online: ${k8sHealth?.payload?.cluster_online ? 'true' : 'false'}`}
              message2={`Nodes: ${k8sHealth?.payload?.nodes?.total}`}
              message3={`Nodes not ready: ${k8sHealth?.payload?.nodes?.in_error}`}
            />

            {/* Components compatibility */}
            <DiagnosticItem
              label="UI/API Check Compatibility"
              value=""
              ok={stateManager.getVariable('Compatibility')}
              message={
                stateManager.getVariable('Compatibility')
                  ? ''
                  : 'UI/API versions not shown in the compatibility list. You can proceed, but errors may occur.'
              }
              message4={
                stateManager.getVariable('Compatibility') ? (
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
