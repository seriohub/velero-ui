'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from '@mantine/form';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

import { IconLock, IconUser } from '@tabler/icons-react';
import { env } from 'next-runtime-env';

import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';

import { SwitchCluster } from '@/components/Features/Config/SwitchCluster/SwitchCluster';
import { Logo } from '@/components/Display/Logo';

export function AuthenticationForm() {
  const serverValues = useServerStatus();
  const appValues = useAppStatus();
  const searchParams = useSearchParams();

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
      await new Promise((resolve) => setTimeout(resolve, 100));
      //appValues.setAuthenticated(true);
      if (serverValues.isCurrentServerControlPlane) {
        const next = searchParams.get('next') || sessionStorage.getItem('next') || '/home';
        router.push(next);
      } else {
        const next = searchParams.get('next') || sessionStorage.getItem('next') || '/dashboard';
        router.push(next);
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
      <Logo/>

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
              required
              placeholder="Your username"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username && 'Login failed!'}
            />
          </Box>

          <PasswordInput
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
