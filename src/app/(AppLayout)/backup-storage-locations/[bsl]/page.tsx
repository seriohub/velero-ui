'use client';

import { use } from "react";
import { BslDetails } from '@/components/Features/Velero/BackupLocations/BslDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function BslPage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><BslDetails params={params}/></WithCoreAndAgentReady>;
}
