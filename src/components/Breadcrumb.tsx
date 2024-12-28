import { useServerStatus } from '@/contexts/ServerContext';
import { Breadcrumbs, Anchor, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface BreadCrumbItemProps {
  name: string;
  href: string;
}

export default function Breadcrumb(breadcrumbItem: BreadCrumbItemProps | undefined) {
  const serverValues = useServerStatus();
  const router = useRouter();

  return (
    <>
      <Breadcrumbs separator="/" separatorMargin="md">
        <Anchor
          onClick={() => {
            router.push('/dashboard');
          }}
          key="current_cluster"
          size="lg"
        >
          {serverValues.currentServer?.name}
        </Anchor>
        <Text size="lg" fw={600}>
          {breadcrumbItem?.name}
        </Text>
      </Breadcrumbs>
    </>
  );
}
