'use client';

import { BackupDetails } from '@/components/Features/Velero/Backups/BackupDetails';

export default function BackupPage({ params }: any) {
  return <BackupDetails params={params} />;
}
