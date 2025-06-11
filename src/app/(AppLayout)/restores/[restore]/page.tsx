'use client';

import { use } from "react";
import { RestoreDetails } from '@/components/Features/Velero/Restores/RestoreDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function RestorePage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><RestoreDetails params={params}/></WithCoreAndAgentReady>;
}
