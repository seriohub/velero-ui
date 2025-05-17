'use client';

import { use } from "react";
import { RestoreDetails } from '@/components/Features/Velero/Restores/RestoreDetails';

export default function RestorePage(props: any) {
  const params = use(props.params);
  return <RestoreDetails params={params}/>;
}
