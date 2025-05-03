'use client';

import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Space,
  ActionIcon,
  Badge,
  Box,
} from '@mantine/core';

import { IconLock, IconUser } from '@tabler/icons-react';
import { env } from 'next-runtime-env';

import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import { SwitchCluster } from '@/components/Features/Config/SwitchCluster/SwitchCluster';

export function AuthenticationForm() {
  const serverValues = useServerStatus();
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();

  const router = useRouter();

  const LoginClustersSwitch = env('NEXT_PUBLIC_LOGIN_CLUSTERS_SWITCH')?.toLowerCase() === 'true';

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (val) => (val.length < 1 ? 'Username can not empty' : null),
      password: (val) => (val.length < 1 ? 'Password can not empty' : null),
    },
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    form.clearErrors();
    const formData = new FormData();
    formData.append('username', form.values.username);
    formData.append('password', form.values.password);
    const res = await fetch(`${serverValues.currentServer?.url}/v1/token`, {
      method: 'POST',
      body: formData,
      // credentials: 'include', // uncomment for cookie auth
    });
    if (res.status === 200) {
      const json = await res.json();
      localStorage.setItem('token', json.access_token);
      await new Promise((resolve) => setTimeout(resolve, 200));
      appValues.setAuthenticated(true);
      if (serverValues.isCurrentServerControlPlane) {
        router.push('/home');
      } else {
        router.push('/dashboard');
      }
    } else {
      form.setErrors({
        username: true,
        password: true,
      });
    }
  }

  return (
    <Paper
      radius={0}
      p="sm"
      withBorder
      style={{
        width: '100%',
        border: 'none',
      }}
    >
      <Text size="22px" fw={800} lightHidden c="white">
        Velero
      </Text>
      <Text size="22px" fw={800} darkHidden c="dark">
        Velero
      </Text>

      <Text
        style={{
          fontSize: '12px',
          marginTop: '2%',
        }}
        c="dimmed"
      >
        Backup Simplified
      </Text>

      <Space h="xl"/>

      {LoginClustersSwitch && <SwitchCluster/>}

      <form onSubmit={handleSubmit}>
        <Stack>
          <Box style={{ marginTop: '8%' }}>
            <TextInput
              //variant="filled"
              leftSection={
                <ActionIcon variant="outline" p={4} tabIndex={-1}>
                  <IconUser/>
                </ActionIcon>
              }
              rightSection={
                (appValues.appInfo?.auth_type === 'LDAP' && (
                  <Group justify="flex-end">
                    <Badge p={2} color="var(--mantine-primary-color-filled)" radius="xs">
                      LDAP
                    </Badge>
                  </Group>
                ))
              }
              size="md"
              //style={{ marginTop: '8%' }}
              required
              placeholder="Your username"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username && 'Login failed!'}
            />
          </Box>

          <PasswordInput
            //variant="filled"
            leftSection={
              <ActionIcon variant="outline" p={4} tabIndex={-1}>
                <IconLock/>
              </ActionIcon>
            }
            size="md"
            required
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Login failed!'}
          />
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button fullWidth type="submit">
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
