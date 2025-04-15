import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

export default function Breadcrumb(breadcrumbItem = []) {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const router = useRouter();
  const items = Object.values(breadcrumbItem).map((item: any, index: number) =>
    item?.href ? (
      <Anchor
        onClick={() => {
          router.push(`${item?.href}`);
        }}
        key={index}
      >
        {item.name}
      </Anchor>
    ) : (
      <Text key={index}>{item.name}</Text>
    )
  );

  return (
    <>
      <Breadcrumbs separator="/" separatorMargin="md">
        {serverValues.isCurrentServerControlPlane ? `${serverValues.currentServer?.name}` : null}
        <Anchor
          onClick={() => {
            router.push('/dashboard');
          }}
          key="current_cluster"
          size="lg"
        >
          {agentValues.currentAgent?.name}
        </Anchor>
        {items}
      </Breadcrumbs>
    </>
  );
}
