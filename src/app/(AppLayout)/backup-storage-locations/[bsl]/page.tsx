'use client';

import { BackupLocation } from '@/components/Velero/BackupLocation/BackupLocation';

export default function BslPage({ params }: any) {
  return <BackupLocation params={params} />;
}
