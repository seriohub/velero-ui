'use client';

import { ActionIcon, Group, Indicator, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconRefresh, IconRotateClockwise } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { useAppStatus } from '@/contexts/AppContext';

import TableVersion from './TableVersion';
import { compareVersions } from './CompareVersion';

export default function CheckAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [opened, {
    open,
    close
  }] = useDisclosure(false);
  const appValues = useAppStatus();

  useEffect(() => {
    const currentAppVersion = appValues.appInfo;
    if (currentAppVersion?.helm_version && appValues.repoVersion?.helm) {
      const cmp = compareVersions(currentAppVersion?.helm_version, appValues.repoVersion?.helm?.replace(/^[a-zA-Z]/, ''));
      if (cmp === 'githubRelease') {
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }
    }
  }, [appValues.repoVersion]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`App version v${appValues.appInfo?.helm_app_version}`}
        size="lg"
      >
        <TableVersion app={appValues.appInfo} githubRelease={appValues.repoVersion}/>
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
            <IconRefresh size={18}/>
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
          {updateAvailable && <IconRotateClockwise/>}
          {!updateAvailable && <IconRotateClockwise/>}
        </ActionIcon>
      </Indicator>
    </>
  );
}
