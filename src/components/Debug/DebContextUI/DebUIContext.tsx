'use client';

import { useRef } from 'react';
import { ScrollArea, Code, Box, Text } from '@mantine/core';
import { DebInfoContextJson } from '../DebContextJson';
import { useUserCtx } from '@/contexts/UserContext';
import { useUIState } from '@/contexts/UIStateContext';

type UIValues = { [key: string]: any }; // Tipo generico per appValues

interface DebUIContextProps {
  [key: string]: any; // Puoi specificare le prop se conosci la loro struttura
}

export default function DebUIContext(props: DebUIContextProps) {
  let uiValues: UIValues;

  try {
    uiValues = useUIState();
  } catch (error: any) {
    console.error(error.message);
    // Puoi mostrare un messaggio di fallback o eseguire altre azioni
    return <Text fw="800" size="sm">Not logged.</Text>;
  }

  const viewport = useRef<HTMLDivElement>(null);

  // Filtrare appValues basandosi sulle chiavi
  const filteredAppValues: UIValues = Object.keys(uiValues)
    .filter(key => !key.startsWith('set')) // Esclude chiavi che iniziano con "set"
    .filter(key => !key.startsWith('api')) // Esclude chiavi che iniziano con "api"
    .filter(key => !key.endsWith('History')) // Esclude chiavi che terminano con "History"
    .reduce((acc: UIValues, key: string) => {
      acc[key] = uiValues[key];
      return acc;
    }, {});

  return (
    <ScrollArea
      px={10}
      type="always"
      viewportRef={viewport}
      scrollbarSize={8} {...props}
    >
      <Code block>
        <DebInfoContextJson data={filteredAppValues} />
      </Code>
    </ScrollArea>
  );
}