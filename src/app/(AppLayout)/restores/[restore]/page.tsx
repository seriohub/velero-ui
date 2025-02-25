'use client';

import { RestoreDetails } from '@/components/Features/Velero/Restores/RestoreDetails';

export default function RestorePage({ params }: any) {
  return <RestoreDetails params={params} />;
}
