import { Accordion, Tabs } from '@mantine/core';

import { IconTerminal2, IconPrompt, IconApi, IconBell } from '@tabler/icons-react';

import ShellCommands from '../../ShellCommands/ShellCommands';
import InfoApiRequest from '../../InfoApiRequest/InfoApiRequest';
import InfoNotification from '@/components/InfoNotification/InfoNotification';
import InfoApiReponse from '@/components/InfoApiResponse/InfoApiResponse';

export function AppShellMainFooter() {
  return (
    <>
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
    </>
  );
}
