'use client';

import { useEffect, useState } from 'react';

import { Group, Tooltip, Tabs, Space, Button, Box, Text } from '@mantine/core';
import {
  IconDeviceFloppy,
  IconDownload,
  IconServer,
  IconProgress,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';

import BackupRestoreInProgress from '@/components/Features/Velero/BackupRestoreInProgress';
import ServerStatusRequests from '@/components/Features/Velero/Requests/ServerStatusRequests';
import DownloadRequests from '@/components/Features/Velero/Requests/DownloadRequests';
import DeleteBackupRequests from '@/components/Features/Velero/Requests/DeleteBackupRequests';

export default function TaskInProgressAccordion() {
  const [reload, setReload] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('BackupRestoreInProgress');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(localStorage.getItem('showTaskInProgress') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('showTaskInProgress', opened ? 'true' : 'false');
  }, [opened]);

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
                    Backup/Restore
                  </Tabs.Tab>
                  <Tabs.Tab value="ServerStatusRequests" leftSection={<IconServer size={16} />}>
                    Server Status Requests
                  </Tabs.Tab>
                  <Tabs.Tab value="DownloadRequests" leftSection={<IconDownload size={16} />}>
                    Download Requests
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="DeleteBackupRequests"
                    leftSection={<IconDeviceFloppy size={16} />}
                  >
                    Delete Backup Requests
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
