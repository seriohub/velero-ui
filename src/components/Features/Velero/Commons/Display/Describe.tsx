'use client';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';

interface DescribeProps {
  items: object;
  fetching: boolean;
  error: boolean;
}

export function Describe({ items = {} }: DescribeProps) {
  return <JsonView data={items} shouldExpandNode={allExpanded} style={defaultStyles} />;
}
