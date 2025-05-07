import { ActionIcon, Group, Indicator, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconRefresh, IconRotateClockwise } from '@tabler/icons-react';

import { useEffect, useState } from 'react';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';

import { useAgentInfo } from '@/api/Agent/useAgentInfo';
import { useCoreInfo } from '@/api/Core/useCoreInfo';

import TableVersion from './TableVersion';
import { compareVersions } from './CompareVersion';

export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  const { data: agentData, getAgentInfo } = useAgentInfo();
  const { data: coreData, getCoreInfo } = useCoreInfo();

  useEffect(() => {
    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
      getCoreInfo();
    }

    if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
      getAgentInfo();
    }
  }, [
    serverValues.isServerAvailable,
    serverValues.isCurrentServerControlPlane,
    agentValues.isAgentAvailable,
  ]);

  useEffect(() => {
    const currentAppVersion = agentData || coreData;
    if (currentAppVersion?.helm_version && appValues.repoVersion?.helm) {
      const cmp = compareVersions(currentAppVersion?.helm_version, appValues.repoVersion?.helm);

      if (cmp === 'githubRelease') {
        setUpdateAvailable(true);
      }
    }
  }, [agentData, coreData, appValues.repoVersion]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`App version v${appValues.appInfo?.helm_app_version}`}
        size="lg"
      >
        <TableVersion app={agentData || coreData} githubRelease={appValues.repoVersion} />
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
          variant="outline"
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
