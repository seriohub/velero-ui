'use client';

import { SnapshotLocation } from '@/components/Velero/SnaphotLocation/SnapshotLocation';

export default function VslPage({ params }: any) {
  return (
    <>
      <SnapshotLocation params={params} />
    </>
  );
}
