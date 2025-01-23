'use client';

import { Repo } from '@/components/Velero/Repo/Repo';

export default function RepoPage({ params }: any) {
  return (
    <>
      <Repo params={params} />
    </>
  );
}
