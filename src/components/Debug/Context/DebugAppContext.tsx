'use client';

import { useRef } from 'react';

import { ScrollArea, Code, Box } from '@mantine/core';

import { DebInfoContextJson } from '../DebContextJson';
import { useAppStatus } from '@/contexts/AppContext';

export default function DebugAppContext(props: any) {
  const appValues = useAppStatus();
  const viewport = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollArea px={10} type="always" viewportRef={viewport} scrollbarSize={8} {...props}>
        <Code block>
          <DebInfoContextJson data={appValues} />
        </Code>
      </ScrollArea>
    </>
  );
}
