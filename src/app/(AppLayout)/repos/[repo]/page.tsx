'use client';

import { use } from "react";
import { RepoDetails } from '@/components/Features/Velero/Repos/RepoDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function RepoPage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><RepoDetails params={params}/></WithCoreAndAgentReady>;
}
