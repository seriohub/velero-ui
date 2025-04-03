'use client';;
import { use } from "react";

import { PVBDetails } from '@/components/Features/Velero/PodVolumes/PVBDetails';

export default function PVBDetailsPage(props: any) {
  const params = use(props.params);
  return <PVBDetails params={params} type="PodVolumeBackup" />;
}
