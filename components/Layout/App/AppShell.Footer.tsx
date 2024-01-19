import { Accordion, Tabs } from '@mantine/core';

import { IconTerminal2, IconPrompt, IconApi } from '@tabler/icons-react';

import ShellCommands from '../../ShellCommands/ShellCommands';
import InfoApiRequest from '../../InfoApiRequest/InfoApiRequest';

export function AppShellFooter() {
  return (
    <>
      <Accordion.Item key="Debug" value="Debug">
        <Accordion.Control icon={<IconPrompt />}>Debug</Accordion.Control>
        <Accordion.Panel>
          <Tabs defaultValue="Shell" orientation="vertical">
            <Tabs.List>
              <Tabs.Tab value="Shell" leftSection={<IconTerminal2 />}>
                Shell
              </Tabs.Tab>
              <Tabs.Tab value="API" leftSection={<IconApi />}>
                API
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Shell">
              <ShellCommands />
            </Tabs.Panel>

            <Tabs.Panel value="API">
              <InfoApiRequest />
            </Tabs.Panel>
          </Tabs>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
