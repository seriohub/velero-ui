'use client';

import { Backup } from '@/components/Velero/Backup/Backup';

export default function BackupPage({ params }: any) {
  return <Backup params={params} />;
}
