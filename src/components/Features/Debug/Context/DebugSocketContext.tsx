'use client';

import { useRef } from 'react';
import { ScrollArea, Code, Text } from '@mantine/core';
import { useSocketStatus } from '@/contexts/SocketContext';

import { DebInfoContextJson } from '../DebContextJson';

type AppValues = { [key: string]: any }; // Tipo generico per appValues

interface DebSocketContextProps {
  [key: string]: any; // Puoi specificare le prop se conosci la loro struttura
}

export default function DebugSocketContext(props: DebSocketContextProps) {
  let socketValues: AppValues;

  try {
    socketValues = useSocketStatus();
  } catch (error: any) {
    console.error(error.message);
    // Puoi mostrare un messaggio di fallback o eseguire altre azioni
    return (
      <Text fw="800" size="sm">
        Not logged.
      </Text>
    );
  }

  const viewport = useRef<HTMLDivElement>(null);

  // Filtrare appValues basandosi sulle chiavi
  const filteredAppValues: AppValues = Object.keys(socketValues)
    //.filter(key => !key.startsWith('set')) // Esclude chiavi che iniziano con "set"
    //.filter(key => !key.startsWith('api')) // Esclude chiavi che iniziano con "api"
    //.filter(key => !key.endsWith('History')) // Esclude chiavi che terminano con "History"
    .reduce((acc: AppValues, key: string) => {
      acc[key] = socketValues[key];
      return acc;
    }, {});

  return (
    <ScrollArea px={10} type="always" viewportRef={viewport} scrollbarSize={8} {...props}>
      <Code block>
        <DebInfoContextJson data={filteredAppValues} />
      </Code>
    </ScrollArea>
  );
}
