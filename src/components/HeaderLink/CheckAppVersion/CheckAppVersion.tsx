import { ActionIcon, Group, Indicator, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconRefresh, IconRotateClockwise } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import TableVersion from './TableVersion';

import { compareVersions } from './CompareVersion';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentInfo } from '@/api/Agent/useAgentInfo';
import { useCoreInfo } from '@/api/Core/useCoreInfo';
import { useAppStatus } from '@/contexts/AppContext';

export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailabe] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  // const { data: repoVersion, getRepoVersion } = useGithubRepoVersion();

  const { data: agentData, getAgentInfo } = useAgentInfo();
  const { data: coreData, getCoreInfo } = useCoreInfo();

  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
      getCoreInfo();
      // getRepoVersion('core');
    }

    if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
      getAgentInfo();
      //getRepoVersion('agent');
    }
  }, [
    serverValues.isServerAvailable,
    serverValues.isCurrentServerControlPlane,
    agentValues.isAgentAvailable,
  ]);

  useEffect(() => {
    const currentAppVersion = agentData || coreData;
    if (currentAppVersion?.payload?.helm_version && appValues.repoVersion?.helm) {
      const cmp = compareVersions(
        currentAppVersion?.payload?.helm_version,
        appValues.repoVersion?.helm
      );

      if (cmp == 'githubRelease') {
        setUpdateAvailabe(true);
      }
    }
  }, [agentData, coreData, appValues.repoVersion]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="App Version" size="lg">
        <TableVersion
          app={agentData?.payload || coreData?.payload}
          githubRelease={appValues.repoVersion}
        />
        <Group justify="flex-end">
          <Text size="sm">Last check {appValues.repoVersion?.datetime || 'N.A'}</Text>
          <ActionIcon
            variant="outline"
            size="compact-xs"
            aria-label="Settings"
            onClick={() => {
              appValues.setRefreshRepoVersion((prev: number) => prev + 1);
            }}
          >
            <IconRefresh size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Modal>
      <Indicator processing inline disabled={!updateAvailable} position="top-end">
        <ActionIcon
          variant="default"
          size={38}
          radius={8}
          aria-label="Toggle color scheme"
          onClick={open}
        >
          {updateAvailable && <IconRotateClockwise stroke={1.5} />}
          {!updateAvailable && <IconRotateClockwise stroke={1.5} />}
        </ActionIcon>
      </Indicator>
    </>
  );
}
