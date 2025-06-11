'use client';

import { Center, Loader } from '@mantine/core';

import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface DetailProps {
  record: string;
}

export function JsonViewer({ record = '' }: DetailProps) {
  if (record === undefined) {
    return (
      <Center>
        <Loader/>
      </Center>
    );
  }

  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      <JsonView data={record} shouldExpandNode={allExpanded} style={defaultStyles}/>
    </div>
  );
}
