'use client';

import { SnapshotLocationDetails } from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetails';

export default function VslPage({ params }: any) {
  return <SnapshotLocationDetails params={params} />;
}
