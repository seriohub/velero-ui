import { useApiGet } from '@/hooks/useApiGet';
import { ActionIcon, Indicator, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconApps } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import TableVersion from './TableVersion';

import { compareVersions } from './CompareVersion';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailabe] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();
  const { data, getData } = useApiGet();
  const { data: repoVersion, getData: getRepoVersion } = useApiGet();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%cuseEffect 481 has been called`, `color: green; font-weight: bold;`);

      if (serverValues.isServerAvailable && serverValues.isCurrentServerControlPlane) {
        getData({
          url: '/info/get',
          target: 'core',
        });
        getRepoVersion({
          url: '/info/get-repo-tags',
          target: 'core',
        });
      }
      console.log("---", agentValues.isAgentAvailable)
      console.log("---", serverValues.isCurrentServerControlPlane)
      console.log("---",serverValues.isServerAvailable)
      if (agentValues.isAgentAvailable && !serverValues.isCurrentServerControlPlane) {
        getData({
          url: '/info/get',
          target: 'agent',
        });
        getRepoVersion({
          url: '/info/get-repo-tags',
          target: 'agent',
        });
      }
    }
  }, [serverValues.isCurrentServerControlPlane, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data?.payload?.helm_version && repoVersion?.payload?.helm) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 482 has been called`, `color: green; font-weight: bold;`);

      const cmp = compareVersions(data?.payload?.helm_version, repoVersion?.payload?.helm);
      // console.log(cmp);
      if (cmp == 'githubRelease') {
        setUpdateAvailabe(true);
      }
    }
  }, [data, repoVersion]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="App Version" size="lg">
        <TableVersion app={data?.payload} githubRelease={repoVersion?.payload} />
      </Modal>
      <Indicator processing inline disabled={!updateAvailable} color="red" position="bottom-end">
        <ActionIcon
          variant="default"
          size={40}
          radius={8}
          aria-label="Toggle color scheme"
          onClick={open}
        >
          {updateAvailable && <IconApps color="orange" stroke={1.5} />}
          {!updateAvailable && <IconApps color="green" stroke={1.5} />}
        </ActionIcon>
      </Indicator>
    </>
  );
}
