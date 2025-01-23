'use client';

import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

export default function BackupsStepperDescription({ backup }: any) {
  return <VeleroResourceStatusBadge status={backup?.status?.phase} />;
}
