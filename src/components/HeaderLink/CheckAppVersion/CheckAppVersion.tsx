import { ActionIcon, Indicator, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconApps, IconRotateClockwise } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import TableVersion from './TableVersion';

import { compareVersions } from './CompareVersion';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentInfo } from '@/api/Agent/useAgentInfo';
import { useCoreInfo } from '@/api/Core/useCoreInfo';
import { useGithubRepoVersion } from '@/api/App/useGithubRepoVersion';

export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailabe] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const { data: repoVersion, getRepoVersion } = useGithubRepoVersion();

  const { data: agentData, getAgentInfo } = useAgentInfo();
  const { data: coreData, getCoreInfo } = useCoreInfo();

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 481 has been called`, `color: green; font-weight: bold;`);

    if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
      getCoreInfo();
      getRepoVersion('core');
    }

    if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
      getAgentInfo();
      getRepoVersion('agent');
    }
  }, [
    serverValues.isServerAvailable,
    serverValues.isCurrentServerControlPlane,
    agentValues.isAgentAvailable,
  ]);

  useEffect(() => {
    const c = agentData || coreData;
    if (c?.payload?.helm_version && repoVersion?.payload?.helm) {
      // if (process.env.NODE_ENV === 'development')
      //  console.log(`%cuseEffect 482 has been called`, `color: green; font-weight: bold;`);

      const cmp = compareVersions(c?.payload?.helm_version, repoVersion?.payload?.helm);
      // console.log(cmp);
      if (cmp == 'githubRelease') {
        setUpdateAvailabe(true);
      }
    }
  }, [agentData, coreData, repoVersion]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="App Version" size="lg">
        <TableVersion
          app={agentData?.payload || coreData?.payload}
          githubRelease={repoVersion?.payload}
        />
      </Modal>
      <Indicator processing inline disabled={!updateAvailable} color="red" position="bottom-end">
        <ActionIcon
          variant="default"
          size={38}
          radius={8}
          aria-label="Toggle color scheme"
          onClick={open}
        >
          {updateAvailable && <IconRotateClockwise color="green" stroke={2} />}
          {!updateAvailable && <IconRotateClockwise stroke={2} />}
        </ActionIcon>
      </Indicator>
    </>
  );
}
