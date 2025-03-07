import { Box, Card, Divider, Group, ScrollArea, Text, Tooltip } from '@mantine/core';

import { getDurationDetails } from '@/utils/getDurationDetails';

import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

function get_duration({ status }: { status: any }) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const { formattedDuration, duration } = getDurationDetails(startTimestamp, completionTimestamp);
    return (
      <Tooltip label={duration} color="blue">
        <Text fw={600}>{formattedDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function RestoreDetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.metadata?.uid}</Text>
          </Group>

          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status.phase} />}
          </Group>
          {data?.status?.errors && (
            <Group mt={10}>
              <Text w={170}>Error:</Text>
              <Text fw={600}>{data?.status.errors}</Text>
            </Group>
          )}
          {data?.status?.warnings && (
            <Group mt={10}>
              <Text w={170}>Warnings:</Text>
              <Text fw={600}>{data?.status.warnings}</Text>
            </Group>
          )}
          <Group mt={10}>
            <Text w={170}>Duration:</Text>
            {get_duration({ status: data?.status })}
          </Group>
          <Group mt={10}>
            <Text w={170}>Items:</Text>
            {data?.status?.progress?.totalItems}
          </Group>
          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Included namespaces:</Text>
            <Box>
              {data?.spec?.includedNamespaces?.length > 0 ? (
                data.spec.includedNamespaces.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}>-</Text>
              )}
            </Box>
          </Group>
          <Group mt={10}>
            <Text w={170}>Esclude namespaces:</Text>
            <Box>
              {data?.spec?.exludeNamespaces?.length > 0 ? (
                data.spec.exludeNamespaces.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}>-</Text>
              )}
            </Box>
          </Group>
          <Group mt={10}>
            <Text w={170}>Include resources:</Text>
            <Box>
              {data?.spec?.includeNamespaces?.length > 0 ? (
                data.spec.includeNamespaces.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}>-</Text>
              )}
            </Box>
          </Group>
          <Group mt={10}>
            <Text w={170}>Exclude resources:</Text>
            <Box>
              {data?.spec?.excludedResources?.length > 0 ? (
                data.spec.excludedResources.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}>-</Text>
              )}
            </Box>
          </Group>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
