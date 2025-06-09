'use client';

import { use } from "react";
import { SnapshotLocationDetails } from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function VslPage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><SnapshotLocationDetails params={params}/></WithCoreAndAgentReady>;
}
