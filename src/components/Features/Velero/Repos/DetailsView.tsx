import { Box, Card, Group, ScrollArea, Text } from '@mantine/core';

export function DetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.metadata.uid}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Type:</Text>
            <Text fw={600}>{data?.spec.repositoryType}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Restic Identifier:</Text>
            <Text fw={600}>{data?.spec.resticIdentifier}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Storage Location:</Text>
            <Text fw={600}>{data?.spec.backupStorageLocation}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Volume namespace:</Text>
            <Text fw={600}>{data?.spec.volumeNamespace}</Text>
          </Group>

          {data?.status?.message && (
            <>
              <Group mt={10}>
                <Text w={170}>Message:</Text>
                <Box w={500}>
                  <Text fw={600}>{data?.status.message}</Text>
                </Box>
              </Group>
            </>
          )}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
