'use client';;
import { use } from "react";

import { BslDetails } from '@/components/Features/Velero/BackupLocations/BslDetails';

export default function BslPage(props: any) {
  const params = use(props.params);
  return <BslDetails params={params} />;
}
