import DebAppContext from '@/components/Debug/DebContextApp/DebAppContext';

import DebServerContext from '@/components/Debug/DebContextServer/DebServerContext';

import { Tabs } from '@mantine/core';

import React from 'react';

export function DebAsideAuth({ value, setValue }: any) {
  return (
    <>
      <Tabs defaultValue="APP-Context">
        <Tabs.List>
          <Tabs.Tab value="APP-Context">App Context</Tabs.Tab>
          <Tabs.Tab value="Server-Context">Server Context</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="APP-Context">
          <DebAppContext />
        </Tabs.Panel>

        <Tabs.Panel value="Server-Context">
          <DebServerContext />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
