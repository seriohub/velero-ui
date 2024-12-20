'use client';

import { Text, Group, Divider, Box, Title } from '@mantine/core';
import Breadcrumb from './Breadcrumb';
import { useUserCtx } from '@/contexts/UserContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

interface BreadCrumbItemProps {
  name: string;
  href: string;
}

interface ToolbarProps {
  title: string;
  children: any;
  breadcrumbItem?: BreadCrumbItemProps | undefined;
  fetching?: boolean;
}

export default function Toolbar({ title, children, breadcrumbItem, fetching }: ToolbarProps) {
  const serverValues = useServerStatus();
  const userValues = useUserCtx();
  return (
    <Box mt={5} mb={15}>
      <Group justify="space-between">
        {title == 'Dashboard' && (
          <Title order={2} fw={800}>
            {serverValues.currentServer?.name} dashboard
          </Title>
        )}
      </Group>
      <Group mb={20} justify="space-between" align="center">
        {title !== 'Dashboard' && breadcrumbItem && <Breadcrumb {...breadcrumbItem} />}
        {title == 'Dashboard' && <Text mt={20}>Welcome back, {userValues.user?.username}!</Text>}
        <Group gap="xs">{children}</Group>
      </Group>

      <Divider />
    </Box>
  );
}
