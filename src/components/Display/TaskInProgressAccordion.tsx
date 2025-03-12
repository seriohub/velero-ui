'use client';

import { useEffect, useState } from 'react';

import { Group, Tooltip, Tabs, Space, Button, Box, Text, Indicator } from '@mantine/core';
import {
  IconDeviceFloppy,
  IconDownload,
  IconServer,
  IconProgress,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';

import { debounce } from 'lodash';
import BackupRestoreInProgress from '@/components/Features/Velero/BackupRestoreInProgress';
import ServerStatusRequests from '@/components/Features/Velero/Requests/ServerStatusRequests';
import DownloadRequests from '@/components/Features/Velero/Requests/DownloadRequests';
import DeleteBackupRequests from '@/components/Features/Velero/Requests/DeleteBackupRequests';
import { eventEmitter } from '@/lib/EventEmitter.js';

export default function TaskInProgressAccordion() {
  const [reload, setReload] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('BackupRestoreInProgress');
  const [opened, setOpened] = useState(false);

  const [backupRestoreNotify, setBackupRestoreNotify] = useState(false);
  const [serverStatusRequestNotify, setServerStatusRequestNotify] = useState(false);
  const [downloadRequestsNotify, setDownloadRequests] = useState(false);
  const [deleteBackupRequests, setDeleteBackupRequests] = useState(false);

  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'backups' || message?.resources === 'restores') {
      setBackupRestoreNotify(true);
      const timer = setTimeout(() => {
        setBackupRestoreNotify(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.resources === 'serverstatusrequests') {
      setServerStatusRequestNotify(true);
      const timer = setTimeout(() => {
        setServerStatusRequestNotify(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.resources === 'downloadrequests') {
      setDownloadRequests(true);
      const timer = setTimeout(() => {
        setDownloadRequests(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (message?.resources === 'deletebackuprequests') {
      setDeleteBackupRequests(true);
      const timer = setTimeout(() => {
        setDeleteBackupRequests(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, 250);

  useEffect(() => {
    setOpened(localStorage.getItem('showTaskInProgress') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('showTaskInProgress', opened ? 'true' : 'false');
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
            p="sm"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => setOpened(!opened)}
          >
            {/*<Button size="xs" onClick={() => setOpened(!opened)}>
              Show Task in progress
            </Button>*/}
            <Text size="sm">Show Task in progress</Text>
          </Group>
        )}

        {opened && (
          <Box p="sm">
            <Tabs defaultValue="BackupRestoreInProgress" value={activeTab} onChange={setActiveTab}>
              <Group justify="space-between">
                <Tabs.List>
                  <Tabs.Tab
                    value="BackupRestoreInProgress"
                    leftSection={<IconProgress size={16} />}
                  >
                    <Indicator disabled={!backupRestoreNotify} processing>
                      <Text size="sm" mr={5}>
                        Backups/Restores
                      </Text>
                    </Indicator>
                  </Tabs.Tab>
                  <Tabs.Tab value="ServerStatusRequests" leftSection={<IconServer size={16} />}>
                    <Indicator disabled={!serverStatusRequestNotify} processing>
                      <Text size="sm" mr={5}>
                        Server Status Requests
                      </Text>
                    </Indicator>
                  </Tabs.Tab>
                  <Tabs.Tab value="DownloadRequests" leftSection={<IconDownload size={16} />}>
                    <Indicator disabled={!downloadRequestsNotify} processing>
                      <Text size="sm" mr={5}>
                        Download Requests
                      </Text>
                    </Indicator>
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="DeleteBackupRequests"
                    leftSection={<IconDeviceFloppy size={16} />}
                  >
                    <Indicator disabled={!deleteBackupRequests} processing>
                      <Text size="sm" mr={5}>
                        Delete Backup Requests
                      </Text>
                    </Indicator>
                  </Tabs.Tab>
                </Tabs.List>
                <Group gap={10}>
                  <Tooltip label="Click to refresh">
                    <Button
                      //variant="transparent"
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReload(reload + 1);
                      }}
                      onMouseOver={(e) => e.stopPropagation()}
                      color={!fetching ? '' : 'var(--mantine-color-placeholder)'}
                      leftSection={<IconRefresh stroke={1.5} />}
                    >
                      Refresh
                    </Button>
                  </Tooltip>

                  <Button
                    rightSection={<IconX stroke={1.5} />}
                    onClick={() => setOpened(!opened)}
                    // variant="transparent"
                  >
                    Close
                  </Button>
                </Group>
              </Group>

              <Space h={10} />

              <Tabs.Panel value="BackupRestoreInProgress">
                <BackupRestoreInProgress
                  reload={reload}
                  setReload={setReload}
                  setFetchingData={setFetching}
                  active={activeTab === 'BackupRestoreInProgress'}
                />
              </Tabs.Panel>

              <Tabs.Panel value="ServerStatusRequests">
                <ServerStatusRequests
                  reload={reload}
                  setReload={setReload}
                  setFetchingData={setFetching}
                  active={activeTab === 'ServerStatusRequests'}
                />
              </Tabs.Panel>

              <Tabs.Panel value="DownloadRequests">
                <DownloadRequests
                  reload={reload}
                  setReload={setReload}
                  setFetchingData={setFetching}
                  active={activeTab === 'DownloadRequests'}
                />
              </Tabs.Panel>
              <Tabs.Panel value="DeleteBackupRequests">
                <DeleteBackupRequests
                  reload={reload}
                  setReload={setReload}
                  setFetchingData={setFetching}
                  active={activeTab === 'DeleteBackupRequests'}
                />
              </Tabs.Panel>
            </Tabs>
          </Box>
        )}
      </Box>
    </>
  );
}
