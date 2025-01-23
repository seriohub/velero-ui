import { Box, Card, Divider, Group, ScrollArea, Text, Tooltip } from '@mantine/core';
import ExpireIn from '@/components/Velero/Backups/ExpireIn';
import Duration from '@/components/Velero/Backups/Duration';
import VeleroResourceStatusBadge from '@/components/Velero/VeleroResourceStatusBadge';

function get_duration({ status }: { status: any }) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const { formattedDuration, duration } = Duration({
      startTimestamp,
      completionTimestamp,
    });
    return (
      <Tooltip label={duration} color="blue">
        <Text fw={600}>{formattedDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function PVBDetails({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.payload?.metadata.uid}</Text>
          </Group>

          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.payload?.status?.phase && (
              <VeleroResourceStatusBadge status={data?.payload?.status.phase} />
            )}
          </Group>
          {data?.payload?.status.errors && (
            <Group mt={10}>
              <Text w={170}>Error:</Text>
              <Text fw={600}>{data?.payload?.status.errors}</Text>
            </Group>
          )}
          {data?.payload?.status.warnings && (
            <Group mt={10}>
              <Text w={170}>Warnings:</Text>
              <Text fw={600}>{data?.payload?.status.warnings}</Text>
            </Group>
          )}
          <Group mt={10}>
            <Text w={170}>Duration:</Text>
            {get_duration({ status: data?.payload?.status })}
          </Group>
          <Group mt={10}>
            <Text w={170}>Items:</Text>
            {data?.payload?.status?.progress?.totalItems}
          </Group>
          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Included namespaces:</Text>
            <Box>
              {data?.payload?.spec?.includedNamespaces?.length > 0 ? (
                data.payload.spec.includedNamespaces.map((location: string, index: string) => (
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
              {data?.payload?.spec?.exludeNamespaces?.length > 0 ? (
                data.payload.spec.exludeNamespaces.map((location: string, index: string) => (
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
              {data?.payload?.spec?.includeNamespaces?.length > 0 ? (
                data.payload.spec.includeNamespaces.map((location: string, index: string) => (
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
              {data?.payload?.spec?.excludedResources?.length > 0 ? (
                data.payload.spec.excludedResources.map((location: string, index: string) => (
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
