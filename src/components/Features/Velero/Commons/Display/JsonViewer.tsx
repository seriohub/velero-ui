'use client';

import { Loader, Center, Text } from '@mantine/core';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface DetailProps {
  record: string;
}

export function JsonViewer({ record = '' }: DetailProps) {
  if (record === undefined) {
    return (
      <Center>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      <JsonView data={record} shouldExpandNode={allExpanded} style={defaultStyles} />
    </div>
  );
}
