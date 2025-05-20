'use client';

import { useRef } from 'react';

import { ScrollArea, Code } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import { DebInfoContextJson } from '../DebContextJson';

export default function DebugContextAgent(props: any) {
  const agentValues = useAgentStatus();
  const viewport = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollArea px={10} type="always" viewportRef={viewport} scrollbarSize={8} {...props}>
        <Code block>
          <DebInfoContextJson data={agentValues}/>
        </Code>
      </ScrollArea>
    </>
  );
}
