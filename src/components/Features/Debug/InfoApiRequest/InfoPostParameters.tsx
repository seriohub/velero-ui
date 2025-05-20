'use client';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface InfoPostParametersProps {
  params: string;
}

export function InfoPostParameters({ params }: InfoPostParametersProps) {
  return <JsonView data={params} shouldExpandNode={allExpanded} style={defaultStyles}/>;
}
