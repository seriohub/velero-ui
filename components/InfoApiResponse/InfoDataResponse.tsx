'use client';

import { JsonView, allExpanded, defaultStyles, collapseAllNested } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface InfoDataResponseProps {
  data: string;
}

export function InfoDataResponse({ data }: InfoDataResponseProps) {
  return <JsonView data={data} shouldExpandNode={collapseAllNested} style={defaultStyles} />;
}
