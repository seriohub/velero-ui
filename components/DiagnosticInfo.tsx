import { useEffect, useState } from 'react';

import { Box, Group, List, Space, Text, ThemeIcon, rem } from '@mantine/core';
import { useApiGet } from '@/hooks/useApiGet';
import { IconCheck, IconCircleCheck, IconX } from '@tabler/icons-react';
import { env } from 'next-runtime-env';
import { useUrlAvailability } from '@/hooks/checkUrlAvailability';
import { DiagnosticLink } from './DiagnosticLink';

export const DiagnosticInfo = () => {
  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: ApiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: ApiArch, getData: getApiArch } = useApiGet();

  const [UiURL, setUiHost] = useState('');
  const ApiURL = env('NEXT_PUBLIC_VELERO_API_URL');

  const [origins, setOrigins] = useState<string | any>('');

  const { isUrlAvailable, loading, checkAvailability } = useUrlAvailability();

  useEffect(() => {
    getDataK8sHealth('/info/health-k8s');
    getApiOrigins('/info/origins');
    getApiArch('/info/arch')

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(currentURL.protocol + '//' + currentURL.host);
    }
  }, []);

  useEffect(() => {
    if (ApiURL !== undefined) checkAvailability(ApiURL + '/info/health');
  }, [ApiURL]);

  useEffect(() => {
    if (ApiOrigins !== undefined) {
      setOrigins(ApiOrigins);
    }
  }, [ApiOrigins]);
  return (
    <Box p="lg">
      <Text size="sm" fw={800}>
        Diagnostic:
      </Text>
      <Space h={20} />
      <List
        spacing="xs"
        size="sm"
        center
        icon={
          <ThemeIcon color="dimmed" size={24} radius="xl">
            <IconCircleCheck color="green" style={{ width: rem(24), height: rem(24) }} />
          </ThemeIcon>
        }
      >
        {/* UI URL*/}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {UiURL != '' && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {UiURL == '' && <IconX color="red" style={{ width: rem(16), height: rem(16) }} />}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Get UI URL:</Text>
            <Text size="sm" fw={800}>
              {UiURL !== undefined && UiURL}
            </Text>
          </Group>
        </List.Item>
        {/* API URL */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {ApiURL != undefined && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {ApiURL == undefined && (
                <IconX color="red" style={{ width: rem(16), height: rem(16) }} />
              )}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Get API URL:</Text>
            <Text size="sm" fw={800}>
              {ApiURL}
            </Text>
          </Group>
        </List.Item>
        {/* API reachable */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {isUrlAvailable && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {!isUrlAvailable && <IconX color="red" style={{ width: rem(16), height: rem(16) }} />}
            </ThemeIcon>
          }
        >
          <Group>
            <Text size="sm">Check API reachable</Text>
            {ApiURL !== undefined && isUrlAvailable && (
              <>
                <DiagnosticLink ApiURL={ApiURL} />
              </>
            )}
          </Group>
        </List.Item>
        {/* API arch */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {isUrlAvailable && ApiArch!==undefined && ApiArch.platform == undefined &&(
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {(!isUrlAvailable || ApiArch?.platform?.length > 0) && <IconX color="red" style={{ width: rem(16), height: rem(16) }} />}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Get API architecture:</Text>
            <Text size="sm" fw={800}>{ApiArch?.arch} {ApiArch?.platform}</Text>
          </Group>
        </List.Item>
        {/* Origins */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {origins.length > 0 && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {origins.length == 0 && (
                <IconX color="red" style={{ width: rem(16), height: rem(16) }} />
              )}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Get Origins:</Text>
            <Text size="sm" fw={800}>
              {origins.length > 0 && origins.join(', ')}
            </Text>
          </Group>
        </List.Item>
        {/* ORIGINS canvalidated */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {origins.length > 0 && (origins.includes(UiURL) || origins.includes('*')) && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {(origins.length == 0 || !origins.includes(UiURL)) && (
                <IconX color="red" style={{ width: rem(16), height: rem(16) }} />
              )}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Validate ORIGINS</Text>
            {origins.length > 0 && origins.includes('*') && (
              <Text size="sm" fw={800} c="orange">
                Warning: ORIGINS contains '*'
              </Text>
            )}
            {(origins.length == 0 || !origins.includes(UiURL)) && (
              <Group gap={5}>
                <Text size="sm">ERROR: ORIGINS must contain</Text>{' '}
                <Text size="sm" fw={800}>
                  {UiURL}
                </Text>
                <Text size="sm">If you have problems you can try to use *</Text>
              </Group>
            )}
          </Group>
        </List.Item>
        {/* Cluster Online */}
        <List.Item
          icon={
            <ThemeIcon color="dimmed" size={24} radius="xl">
              {k8sHealth != undefined && (
                <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />
              )}
              {k8sHealth == undefined && (
                <IconX color="red" style={{ width: rem(16), height: rem(16) }} />
              )}
            </ThemeIcon>
          }
        >
          <Group gap={10}>
            <Text size="sm">Cluster Online:</Text>
            <Text size="sm" fw={700}>
              {k8sHealth?.cluster_online ? 'true' : 'false'}
            </Text>
          </Group>
          <Group gap={10}>
            <Text size="sm">Nodes:</Text>
            <Text size="sm" fw={700}>
              {k8sHealth?.nodes?.total}
            </Text>
          </Group>
          <Group gap={10}>
            <Text size="sm">Nodes in error:</Text>
            <Text size="sm" fw={700}>
              {k8sHealth?.nodes?.in_error}
            </Text>
          </Group>
        </List.Item>
      </List>
    </Box>
  );
};
