'use client';

import { use } from "react";
import { PVBDetails } from '@/components/Features/Velero/PodVolumes/PVBDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function PVBDetailsPage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><PVBDetails params={params} type="PodVolumeRestore"/></WithCoreAndAgentReady>;
}
