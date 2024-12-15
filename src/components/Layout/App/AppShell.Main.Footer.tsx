import { Accordion, Tabs } from '@mantine/core';

import { IconTerminal2, IconPrompt, IconApi, IconBell } from '@tabler/icons-react';

import { useAppState } from '@/contexts/AppStateContext';
import ShellCommands from '@/components/Debug/ShellCommands/ShellCommands';
import InfoApiRequest from '@/components/Debug/InfoApiRequest/InfoApiRequest';
import InfoApiReponse from '@/components/Debug/InfoApiResponse/InfoApiResponse';
import InfoNotification from '@/components/Debug/InfoNotification/InfoNotification';

export function AppShellMainFooter() {
  const appValues = useAppState();

  return (
    <>
      {appValues.showBottomDebugBar && (
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
                  Notification
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="Shell">
                <ShellCommands />
              </Tabs.Panel>

              <Tabs.Panel value="API-Request">
                <InfoApiRequest />
              </Tabs.Panel>

              <Tabs.Panel value="API-Response">
                <InfoApiReponse />
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