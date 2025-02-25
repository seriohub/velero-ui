import { Accordion, Tabs } from '@mantine/core';

import { IconTerminal2, IconPrompt, IconApi, IconBell } from '@tabler/icons-react';

import ShellCommands from '@/components/Features/Debug/ShellCommands/ShellCommands';
import InfoApiRequest from '@/components/Features/Debug/InfoApiRequest/InfoApiRequest';
import InfoApiResponse from '@/components/Features/Debug/InfoApiResponse/InfoApiResponse';
import InfoNotification from '@/components/Features/Debug/InfoNotification/InfoNotification';
import { useUIStatus } from '@/contexts/UIContext';

export function AppShellMainFooter() {
  const uiValues = useUIStatus();

  return (
    <>
      {uiValues.showBottomDebugBar && (
        <Accordion.Item key="Debug" value="Debug" visibleFrom="xl">
          <Accordion.Control icon={<IconPrompt />}>Debug</Accordion.Control>
          <Accordion.Panel>
            <Tabs defaultValue="Shell" orientation="vertical">
              <Tabs.List>
                <Tabs.Tab value="Shell" leftSection={<IconTerminal2 />}>
                  Shell & K8s
                </Tabs.Tab>
                <Tabs.Tab value="API-Request" leftSection={<IconApi />}>
                  Request
                </Tabs.Tab>
                <Tabs.Tab value="API-Response" leftSection={<IconApi />}>
                  Response
                </Tabs.Tab>
                <Tabs.Tab value="Notification" leftSection={<IconBell />}>
                  User Notification
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="Shell">
                <ShellCommands />
              </Tabs.Panel>

              <Tabs.Panel value="API-Request">
                <InfoApiRequest />
              </Tabs.Panel>

              <Tabs.Panel value="API-Response">
                <InfoApiResponse />
              </Tabs.Panel>

              <Tabs.Panel value="Notification">
                <InfoNotification />
              </Tabs.Panel>
            </Tabs>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </>
  );
}
