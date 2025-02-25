'use client';

import { useEffect, useState } from 'react';

import { Group, Text, Mark, useComputedColorScheme, Space, Tabs, Box } from '@mantine/core';

import { IconSettings, IconVariable } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useWatchdogEnvironment } from '@/api/Watchdog/useWatchdogEnvironment';
import { useWatchdogRestart } from '@/api/Watchdog/useWatchdogRestart';
import { useWatchdogCron } from '@/api/Watchdog/useWatchdogCron';
import { useWatchdogSendReport } from '@/api/Watchdog/useWatchdogSendReport';
import { useWatchdogAppConfigs } from '@/api/Watchdog/useWatchdogAppConfigs';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';
import Toolbar from '@/components/Display/Toolbar';

import ReloadData from '@/components/Inputs/ReloadData';
import SendReport from '@/components/Features/Settings/Watchdog/Actions/SendReport';
import ReloadConfig from '@/components/Features/Settings/Watchdog/Actions/ReloadConfig';

import { WatchdogDeployConfigs } from '@/components/Features/Settings/Watchdog/WatchdogDeployConfigs';
import { WatchdogUserConfigs } from '@/components/Features/Settings/Watchdog/WatchdogUserConfigs';
import WatchdogService from '@/components/Features/Settings/Watchdog/WatchdogService';

type Differences<T> = {
  hasDifferences: boolean;
  differences: Record<keyof T, { obj1: any; obj2: any }>;
};

function hasDifferentValues<T extends Record<string, any>>(obj1: T, obj2: T): Differences<T> {
  const differences: Partial<Record<keyof T, { obj1: any; obj2: any }>> = {};
  let hasDifferences = false;

  for (const key in obj2) {
    if (
      key !== 'K8S_INCLUSTER_MODE' &&
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      obj1[key] !== obj2[key]
    ) {
      differences[key] = {
        obj1: obj1[key],
        obj2: obj2[key],
      };
      hasDifferences = true;
    }
  }

  return {
    hasDifferences,
    differences: differences as Record<keyof T, { obj1: any; obj2: any }>,
  };
}

export function Watchdog() {
  const { data: deployConfiguration, getWatchdogConfig } = useWatchdogEnvironment();
  const { data: userConfiguration, getWatchdogAppConfigs } = useWatchdogAppConfigs();

  const [hasDiff, setHasDiff] = useState(false);
  const [difference, setDifference] = useState({});

  const { watchdogSendReport, fetching: reportFetching } = useWatchdogSendReport();
  const { watchdogRestart } = useWatchdogRestart();

  const { data: cron, getWatchdogCron } = useWatchdogCron();
  const [reload, setReload] = useState(1);

  const agentValues = useAgentStatus();
  const computedColorScheme = useComputedColorScheme();

  useEffect(() => {
    getWatchdogConfig();
    getWatchdogCron();
    getWatchdogAppConfigs();
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (deployConfiguration && userConfiguration) {
      const { hasDifferences: diff1, differences: diffs1 } = hasDifferentValues(
        deployConfiguration,
        userConfiguration
      );
      setHasDiff(diff1);
      setDifference(diffs1);
    }
  }, [deployConfiguration, userConfiguration]);

  useEffect(() => {}, [reload]);

  return (
    <PageScrollArea>
      <Toolbar title="Watchdog" breadcrumbItem={[{ name: 'Watchdog' }]}>
        <ReloadConfig
          watchdogReloadConfig={watchdogRestart}
          hasDiff={hasDiff}
          difference={difference}
          setReload={setReload}
        />
        <SendReport fetching={reportFetching} requestSendReport={watchdogSendReport} />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <Tabs orientation="vertical" defaultValue="Environment">
        <Tabs.List>
          <Tabs.Tab value="Environment" leftSection={<IconVariable size={12} />}>
            Pod Environment
          </Tabs.Tab>
          <Tabs.Tab value="Settings" leftSection={<IconSettings size={12} />}>
            User Configuration
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Environment">
          <Box p={10}>
            {cron !== undefined && (
              <Group mx={10} my={20} gap={8}>
                <Text size="sm">Full report cron</Text>
                <Text size="sm">
                  <Mark
                    color={
                      computedColorScheme === 'light'
                        ? 'var(--mantine-primary-color-3)'
                        : 'var(--mantine-primary-color-5)'
                    }
                  >
                    {cron.toString()}
                  </Mark>
                </Text>
              </Group>
            )}
            <WatchdogDeployConfigs
              deployConfiguration={deployConfiguration || {}}
              userConfiguration={userConfiguration || {}}
            />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="Settings">
          <Box p={10}>
            <WatchdogUserConfigs userConfiguration={userConfiguration} setReload={setReload} />
            <Space h={50} />

            <WatchdogService />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </PageScrollArea>
  );
}
