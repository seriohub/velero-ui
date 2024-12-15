import { useServerStatus } from '@/contexts/ServerStatusContext';
import { Breadcrumbs, Anchor, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

const items = [
  { title: 'Mantine', href: '#' },
  { title: 'Mantine hooks', href: '#' },
  { title: 'use-id', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

interface BreadCrumbItemProps {
  name: string;
  href: string;
}

export default function Breadcrumb(breadcrumbItem: BreadCrumbItemProps | undefined) {
  const serverValues = useServerStatus();
  const router = useRouter();

  console.log("---", breadcrumbItem)
  return (
    <>
      {/*<Breadcrumbs>{items}</Breadcrumbs>*/}
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
