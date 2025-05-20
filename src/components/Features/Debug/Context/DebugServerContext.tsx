'use client';

import { useRef } from 'react';

import { ScrollArea, Code } from '@mantine/core';

import { useServerStatus } from '@/contexts/ServerContext';
import { DebInfoContextJson } from '../DebContextJson';

export default function DebugServerContext(props: any) {
  const serverValues = useServerStatus();
  const viewport = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollArea px={10} type="always" viewportRef={viewport} scrollbarSize={8} {...props}>
        <Code block>
          <DebInfoContextJson data={serverValues}/>
        </Code>
      </ScrollArea>
    </>
  );
}
