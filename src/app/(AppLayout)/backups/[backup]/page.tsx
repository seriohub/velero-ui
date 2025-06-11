'use client';

import { use } from "react";
import { BackupDetails } from '@/components/Features/Velero/Backups/BackupDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function BackupPage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><BackupDetails params={params}/></WithCoreAndAgentReady>;
}
