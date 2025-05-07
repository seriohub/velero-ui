'use client';

import { useEffect, useRef, useState } from 'react';

import { Tabs, Stack, ScrollArea } from '@mantine/core';

import { IconSettings, IconVariable } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useWatchdogEnvironment } from '@/api/Watchdog/useWatchdogEnvironment';
import { useWatchdogRestart } from '@/api/Watchdog/useWatchdogRestart';
import { useWatchdogCron } from '@/api/Watchdog/useWatchdogCron';
import { useWatchdogSendReport } from '@/api/Watchdog/useWatchdogSendReport';
import { useWatchdogAppConfigs } from '@/api/Watchdog/useWatchdogAppConfigs';

import Toolbar from '@/components/Display/Toolbar';

import ReloadData from '@/components/Inputs/ReloadData';
import SendReport from '@/components/Features/Settings/Watchdog/Actions/SendReport';
import ReloadConfig from '@/components/Features/Settings/Watchdog/Actions/ReloadConfig';

import { WatchdogEnvironment } from '@/components/Features/Settings/Watchdog/Display/WatchdogEnvironment';
import { MainStack } from '@/components/Commons/MainStack';
import { useUIStatus } from "@/contexts/UIContext";
import { WatchdogUserConfigs } from "@/components/Features/Settings/Watchdog/WatchdogUserConfigs";
import WatchdogService from "@/components/Features/Settings/Watchdog/WatchdogService";

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
  const uiValues = useUIStatus();
  const stackRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState<number>(800);

  const [activeTab, setActiveTab] = useState<string | null>('Environment');

  useEffect(() => {
    if (activeTab === 'Settings' && stackRef.current) {
      setTimeout(() => {
        const height = stackRef.current!.offsetHeight;
        setScrollHeight(height);
      }, 50);
    }
  }, [activeTab]);

  const {
    data: deployConfiguration,
    getWatchdogConfig,
    fetching
  } = useWatchdogEnvironment();
  const {
    data: userConfiguration,
    getWatchdogAppConfigs
  } = useWatchdogAppConfigs();

  const [hasDiff, setHasDiff] = useState(false);

  const {
    watchdogSendReport,
    fetching: reportFetching
  } = useWatchdogSendReport();
  const { watchdogRestart } = useWatchdogRestart();

  const {
    data: cron,
    getWatchdogCron
  } = useWatchdogCron();
  const [reload, setReload] = useState(1);

  const agentValues = useAgentStatus();

  useEffect(() => {
    getWatchdogConfig();
    getWatchdogCron();
    getWatchdogAppConfigs();
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (deployConfiguration && userConfiguration) {
      const {
        hasDifferences: hDiff,
        differences: diffs
      } = hasDifferentValues(
        deployConfiguration,
        userConfiguration
      );
      setHasDiff(hDiff);
    }
  }, [deployConfiguration, userConfiguration]);

  useEffect(() => {
  }, [hasDiff]);

  useEffect(() => {
    const updateHeight = () => {
      if (stackRef.current) {
        const height = stackRef.current.offsetHeight;
        setScrollHeight(height);
      }
    };

    // Initial Call
    updateHeight();

    // Resize Listener
    window.addEventListener('resize', updateHeight);

    // Clean listener
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [uiValues.showTaskInProgress]);

  useEffect(() => {
    if (stackRef.current) {
      const height = stackRef.current.offsetHeight;
      setScrollHeight(height);
    }
  }, []);

  return (
    <MainStack>
      <Toolbar title="Watchdog" breadcrumbItem={[{ name: 'Watchdog' }]}>
        <ReloadData setReload={setReload} reload={reload}/>
        <SendReport fetching={reportFetching} requestSendReport={watchdogSendReport}/>
        <ReloadConfig
          watchdogReloadConfig={watchdogRestart}
          hasDiff={hasDiff}
          setReload={setReload}
        />
      </Toolbar>
      <Tabs defaultValue="Environment" h="calc(100% - 70px)" value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="Environment" leftSection={<IconVariable size={20}/>}>
            Current Environment
          </Tabs.Tab>
          <Tabs.Tab value="Settings" leftSection={<IconSettings size={20}/>}>
            Configuration
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Environment" h="calc(100% - 40px)">
          <Stack h="100%">
            <WatchdogEnvironment
              fetching={fetching}
              cron={cron}
              deployConfiguration={deployConfiguration}
              userConfiguration={userConfiguration}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="Settings" h="calc(100% - 40px)" p={0}>
          <Stack ref={stackRef} h="100%" p={0}>
            <ScrollArea h={scrollHeight} p={0}>
              <WatchdogUserConfigs userConfiguration={userConfiguration} setReload={setReload}/>
              <WatchdogService/>
            </ScrollArea>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </MainStack>
  );
}
