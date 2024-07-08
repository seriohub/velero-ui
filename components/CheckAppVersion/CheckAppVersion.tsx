import { useApiGet } from '@/hooks/useApiGet';
import { ActionIcon, Indicator, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconApps, IconRefresh } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import TableVersion from './TableVersion';

import { compareVersions } from './CompareVersion';


export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailabe] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { data, getData } = useApiGet();
  const { data: repoVersion, getData: getRepoVersion } = useApiGet();

  useEffect(() => {
    getData({url:'/info/get'});
    getRepoVersion({url:'/info/get-repo-tags'});
  }, []);

  useEffect(() => {
    // console.log(data?.payload?.helm_version, repoVersion?.payload?.helm);
    if (data?.payload?.helm_version && repoVersion?.payload?.helm) {
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
      <Indicator processing inline disabled={!updateAvailable} color='red' position='bottom-end'>
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
