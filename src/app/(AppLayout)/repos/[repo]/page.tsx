'use client';

import { RepoDetails } from '@/components/Features/Velero/Repos/RepoDetails';

export default function RepoPage({ params }: any) {
  return (
    <>
      <RepoDetails params={params} />
    </>
  );
}
