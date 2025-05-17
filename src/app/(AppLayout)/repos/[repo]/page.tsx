'use client';

import { use } from "react";
import { RepoDetails } from '@/components/Features/Velero/Repos/RepoDetails';

export default function RepoPage(props: any) {
  const params = use(props.params);
  return (
    <>
      <RepoDetails params={params}/>
    </>
  );
}
