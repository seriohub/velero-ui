'use client';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface DescribeProps {
  items: string;
  fetching: boolean;
  error: boolean;
}

export function Describe({ items = '', fetching, error }: DescribeProps) {
  return <JsonView data={items} shouldExpandNode={allExpanded} style={defaultStyles} />;
}
