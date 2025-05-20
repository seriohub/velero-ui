'use client';

import { use } from "react";
import { BackupDetails } from '@/components/Features/Velero/Backups/BackupDetails';

export default function BackupPage(props: any) {
  const params = use(props.params);
  return <BackupDetails params={params}/>;
}
