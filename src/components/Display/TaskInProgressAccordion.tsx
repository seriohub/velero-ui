'use client';

import { useEffect, useState } from 'react';
import { ActionIcon, Box, Group, Indicator, Switch, Tabs, Text, Tooltip, } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconDownload,
  IconProgress,
  IconServer,
} from '@tabler/icons-react';
import { debounce } from 'lodash';

import { useUIStatus } from '@/contexts/UIContext';
import { eventEmitter } from '@/lib/EventEmitter.js';

import BackupRestoreStream from '@/components/Features/Velero/EventStream/BackupRestoreStream';
import ServerStatusRequests from '@/components/Features/Velero/Requests/ServerStatusRequests';
import DownloadRequests from '@/components/Features/Velero/Requests/DownloadRequests';
import DeleteBackupRequests from '@/components/Features/Velero/Requests/DeleteBackupRequests';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

import styles from '@/styles/TasksProgressAccordion.module.css';

export default function TaskInProgressAccordion() {
  const uiValues = useUIStatus();
  const [reload, setReload] = useState(1);
  const [enableTopToolbar, setEnableTopToolbar] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('BackupRestoreInProgress');
  const [opened, setOpened] = useState(false);

  const [backupRestoreNotify, setBackupRestoreNotify] = useState(false);
  const [serverStatusRequestNotify, setServerStatusRequestNotify] = useState(false);
  const [downloadRequestsNotify, setDownloadRequests] = useState(false);
  const [deleteBackupRequestsNotify, setDeleteBackupRequestsNotify] = useState(false);

  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'restores') {
      setBackupRestoreNotify(true);
      const timer = setTimeout(() => {
        setBackupRestoreNotify(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.payload?.resources === 'serverstatusrequests') {
      setServerStatusRequestNotify(true);
      const timer = setTimeout(() => {
        setServerStatusRequestNotify(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.payload?.resources === 'downloadrequests') {
      setDownloadRequests(true);
      const timer = setTimeout(() => {
        setDownloadRequests(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.payload?.resources === 'deletebackuprequests') {
      setDeleteBackupRequestsNotify(true);
      const timer = setTimeout(() => {
        setDeleteBackupRequestsNotify(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, 150);

  useEffect(() => {
    setOpened(localStorage.getItem('showTaskInProgress') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('showTaskInProgress', opened ? 'true' : 'false');
    uiValues.setShowTaskInProgress(opened);
  }, [opened]);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);

  return (
    <>
      <Box
        style={{
          borderTop: '1px solid',
          borderColor: 'var(--mantine-color-default-border)',
        }}
      >
        {!opened && (
          <Group
            justify="center"
            p={16}
            style={{
              cursor: 'pointer',
            }}
            onClick={() => setOpened(!opened)}
            gap={5}
            className={styles.element}
          >
            <IconChevronUp size={20}/>
            <Text size="sm">Show Task in progress</Text>
          </Group>
        )}

        {opened && (
          <Box
            px={0}
            py={0}
            h={300}
          >
            <Tabs defaultValue="BackupRestoreInProgress" value={activeTab} onChange={setActiveTab}
                  bg="var(--mantine-primary-color-light)">

              <Tabs.List p={0}>
                <Tabs.Tab
                  value="BackupRestoreInProgress"
                  leftSection={<IconProgress size={16}/>}
                >
                  <Indicator disabled={!backupRestoreNotify} processing>
                    <Text size="sm">
                      Backups/Restores
                    </Text>
                  </Indicator>
                </Tabs.Tab>

                <Tabs.Tab
                  value="ServerStatusRequests"
                  leftSection={<IconServer size={16}/>}
                >
                  <Indicator disabled={!serverStatusRequestNotify} processing>
                    <Text size="sm">
                      Server Status Requests
                    </Text>
                  </Indicator>
                </Tabs.Tab>

                <Tabs.Tab
                  value="DownloadRequests"
                  leftSection={<IconDownload size={16}/>}
                >
                  <Indicator disabled={!downloadRequestsNotify} processing>
                    <Text size="sm">
                      Download Requests
                    </Text>
                  </Indicator>
                </Tabs.Tab>

                <Tabs.Tab
                  value="DeleteBackupRequests"
                  leftSection={<IconDeviceFloppy size={16}/>}
                >
                  <Indicator disabled={!deleteBackupRequestsNotify} processing>
                    <Text size="sm">
                      Delete Backup Requests
                    </Text>
                  </Indicator>
                </Tabs.Tab>
                <Box ml="auto">
                  <Group h={42}>
                    <Switch
                      radius="xs"
                      checked={enableTopToolbar}
                      onChange={(event) => setEnableTopToolbar(event.currentTarget.checked)}
                      labelPosition="left"
                      label="Show Toolbar"
                    />
                    <Tooltip label="Close">
                      <ActionIcon
                        variant="subtle"
                        aria-label="Settings"
                        onClick={() => setOpened(!opened)}
                        h={36}
                        w={36}
                        radius={8}
                      >
                        <IconChevronDown/>
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Box>
              </Tabs.List>

              <Tabs.Panel value="BackupRestoreInProgress" p={0}>
                <WithCoreAndAgentReady>
                  <BackupRestoreStream
                    enableTopToolbar={enableTopToolbar}
                    reload={reload}
                    setReload={setReload}
                    setFetchingData={setFetching}
                    active={activeTab === 'BackupRestoreInProgress'}
                  />
                </WithCoreAndAgentReady>
              </Tabs.Panel>

              <Tabs.Panel value="ServerStatusRequests">
                <WithCoreAndAgentReady>
                  <ServerStatusRequests
                    enableTopToolbar={enableTopToolbar}
                    reload={reload}
                    setReload={setReload}
                    setFetchingData={setFetching}
                    active={activeTab === 'ServerStatusRequests'}
                  />
                </WithCoreAndAgentReady>
              </Tabs.Panel>

              <Tabs.Panel value="DownloadRequests">
                <WithCoreAndAgentReady>
                  <DownloadRequests
                    reload={reload}
                    setReload={setReload}
                    setFetchingData={setFetching}
                    active={activeTab === 'DownloadRequests'}
                  />
                </WithCoreAndAgentReady>
              </Tabs.Panel>

              <Tabs.Panel value="DeleteBackupRequests">
                <WithCoreAndAgentReady>
                  <DeleteBackupRequests
                    enableTopToolbar={enableTopToolbar}
                    reload={reload}
                    setReload={setReload}
                    setFetchingData={setFetching}
                    active={activeTab === 'DeleteBackupRequests'}
                  />
                </WithCoreAndAgentReady>
              </Tabs.Panel>
            </Tabs>

          </Box>
        )}
      </Box>
    </>
  );
}
