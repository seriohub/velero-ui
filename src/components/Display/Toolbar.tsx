'use client';

import { Text, Group, Box, Title } from '@mantine/core';

import { useUserStatus } from '@/contexts/UserContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import Breadcrumb from './Breadcrumb';

interface ToolbarProps {
  title: string;
  children: any;
  breadcrumbItem?: any;
  fetching?: boolean;
}

export default function Toolbar({
                                  title,
                                  children,
                                  breadcrumbItem
                                }: ToolbarProps) {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const userValues = useUserStatus();

  return (
    <Box mt={10} mb={10}>
      <Group justify="space-between">
        {(title !== 'Dashboard' && title !== 'Clusters') && breadcrumbItem && <Breadcrumb {...breadcrumbItem} />}
        {title === 'Dashboard' &&
            <Text>Welcome back, {userValues.user?.username}!</Text>
        }
        {title === 'Clusters' &&
            <Title order={2} fw={800}>
              {serverValues.currentServer?.name}
            </Title>
        }
        <Group gap="xs" h="100%">{children}</Group>
      </Group>
    </Box>
  );
}
