import { Accordion, Tabs, Text } from '@mantine/core';

import { IconTerminal2, IconPrompt, IconApi, IconPlus } from '@tabler/icons-react';

import ShellCommands from '../ShellCommands/ShellCommands';
import InfoApiRequest from '../InfoApiRequest/InfoApiRequest';
import classes from './Footer.module.css';

export function AppShellFooter() {
  return (
    <>
      <Accordion
        classNames={{ chevron: classes.chevron }}
        chevron={<IconPlus className={classes.icon} />}
      >
        <Accordion.Item key="Debug" value="Debug">
          <Accordion.Control icon={<IconPrompt />} style={{ paddingTop: '0px' }}>
            <Text>Debug</Text>
          </Accordion.Control>
          <Accordion.Panel style={{ background: '#010101' }}>
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
      </Accordion>
    </>
  );
}
