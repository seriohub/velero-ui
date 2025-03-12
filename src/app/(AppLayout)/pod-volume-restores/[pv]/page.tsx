'use client';

import { PVBDetails } from '@/components/Features/Velero/PodVolumes/PVBDetails';

export default function PVBDetailsPage({ params }: any) {
  return <PVBDetails params={params} type="PodVolumeRestore" />;
}
