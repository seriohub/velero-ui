'use client';

import { use } from "react";
import { SnapshotLocationDetails } from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetails';

export default function VslPage(props: any) {
  const params = use(props.params);
  return <SnapshotLocationDetails params={params}/>;
}
