'use client';

import { JsonView, defaultStyles, collapseAllNested } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface InfoAppContextProps {
  data: any;
}

const jsonStyle = {
  ...defaultStyles,
  // background: 'transparent',
};

export function DebInfoContextJson({ data }: InfoAppContextProps) {
  return <JsonView data={data} shouldExpandNode={collapseAllNested} style={jsonStyle} />;
}
