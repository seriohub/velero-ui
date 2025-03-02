'use client';

import { InspectBackupDetails } from '@/components/Features/Velero/Inspect/InspectBackupDetails';

export default function BackupPage({ params }: any) {
  return <InspectBackupDetails params={params} />;
}
