import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { Breadcrumbs, Anchor, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface BreadCrumbItemProps {
  name: string;
  href: string;
}

export default function Breadcrumb(breadcrumbItem: BreadCrumbItemProps | undefined) {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const router = useRouter();

  return (
    <>
      <Breadcrumbs separator="/" separatorMargin="md">
        {serverValues.isCurrentServerControlPlane ? `[${serverValues.currentServer?.name}] ` : null}
        <Anchor
          onClick={() => {
            router.push('/dashboard');
          }}
          key="current_cluster"
          size="lg"
        >
          {agentValues.currentAgent?.name}
        </Anchor>
        <Text size="lg" fw={600}>
          {breadcrumbItem?.name}
        </Text>
      </Breadcrumbs>
    </>
  );
}
