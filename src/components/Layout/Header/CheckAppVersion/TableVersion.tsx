import { env } from 'next-runtime-env';

import { Anchor, Group, Space, Table, Text } from '@mantine/core';

import { IconArrowUp, IconCheck, IconX } from '@tabler/icons-react';
import { compareVersions } from './CompareVersion';

interface TableVersionProps {
  app: any;
  githubRelease: any;
}

export default function TableVersion({
                                       app,
                                       githubRelease
                                     }: TableVersionProps) {
  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const elements = [
    {
      position: 0,
      name: 'Helm',
      href: 'https://github.com/seriohub/velero-helm',
      appVersion: app?.helm_version,
      githubRelease: githubRelease?.helm,
      updateAvailable: compareVersions(app?.helm_version, githubRelease?.helm?.replace(/^[a-zA-Z]/, '')) === 'githubRelease',
    },
    {
      position: 1,
      name: 'Core',
      href: 'https://github.com/seriohub/vui-core',
      appVersion: app?.helm_core !== '-' ? app?.helm_core : app?.core_release_version,
      githubRelease: '.n.a.', //githubRelease?.core,
      updateAvailable: compareVersions(app?.helm_core, githubRelease?.core?.replace(/^[a-zA-Z]/, '')) === 'githubRelease',
    },
    {
      position: 1,
      name: 'API',
      href: 'https://github.com/seriohub/velero-api',
      appVersion: app?.helm_api !== '-' ? app?.helm_api : app?.api_release_version,
      githubRelease: githubRelease?.api,
      updateAvailable: compareVersions(app?.helm_api, githubRelease?.api?.replace(/^[a-zA-Z]/, '')) === 'githubRelease',
    },
    {
      position: 2,
      name: 'UI',
      href: 'https://github.com/seriohub/velero-ui',
      appVersion: app?.helm_ui !== '-' ? app?.helm_ui : NEXT_PUBLIC_FRONT_END_BUILD_VERSION,
      githubRelease: githubRelease?.ui,
      updateAvailable: compareVersions(app?.helm_ui, githubRelease?.ui?.replace(/^[a-zA-Z]/, '')) === 'githubRelease',
    },
    {
      position: 3,
      name: 'Watchdog',
      href: 'https://github.com/seriohub/velero-watchdog',
      appVersion: app?.helm_watchdog !== '-' ? app?.helm_watchdog : app.watchdog_release_version,
      githubRelease: githubRelease?.watchdog,
      updateAvailable:
        compareVersions(app?.helm_watchdog, githubRelease?.watchdog?.replace(/^[a-zA-Z]/, '')) === 'githubRelease',
    },
  ];

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>
        {element.updateAvailable && <IconArrowUp color="green" size={15}/>}
        <Anchor href={element.href} target="_blank">
          {element.name}
        </Anchor>
      </Table.Td>
      <Table.Td>{element.appVersion && `v${element.appVersion.replace(/^[a-zA-Z]/, '')}`}</Table.Td>
      <Table.Td>{element.githubRelease}</Table.Td>
      <Table.Td>
        <Anchor href={`${element.href}/blob/main/CHANGELOG.md`} target=" _blank">
          changelog
        </Anchor>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Group gap={5}>
        {app?.helm_version !== '-' && <IconCheck color="green" size={16}/>}
        {app?.helm_version === '-' && <IconX color="red" size={16}/>}
        <Text size="sm"> Helm installed (recommended)</Text>
      </Group>
      <Space h="md"/>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Module</Table.Th>
            <Table.Th>Version</Table.Th>
            <Table.Th>Github Release</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Space h="md"/>
    </>
  );
}
