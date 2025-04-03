'use client';;
import { use } from "react";

import { InspectBackupDetails } from '@/components/Features/Velero/Inspect/InspectBackupDetails';

export default function BackupPage(props: any) {
  const params = use(props.params);
  return <InspectBackupDetails params={params} />;
}
