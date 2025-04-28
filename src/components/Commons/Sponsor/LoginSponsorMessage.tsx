'use client';

import {
  Text,
  Paper,
  Space,
  Grid,
  Button,
  Image,
  Title,
  useComputedColorScheme, Group, Anchor,
} from '@mantine/core';

import { IconHeart } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import image from './donate.svg';

export function LoginSponsorMessage() {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [init, setInit] = useState(false);
  useEffect(() => {
    setInit(true);
  }, [computedColorScheme]);

  if (!init) return <></>;

  return (
    <>
      <Paper
        shadow="xs"
        p="xl"
        withBorder
        maw="800"
        bg={computedColorScheme === 'light' ? '#f2f3f5' : '#1f1f1f'}
      >
        <Grid>
          <Grid.Col span={10}>
            <Title order={4}>Hold on a moment...</Title>
            <Text fw={500} fz="sm" mb={5}>
              💬 A huge thank you to our sponsors for making VUI possible!
            </Text>

            <Button
              component="a"
              /*leftSection={<IconHeart />}*/
              //h={40}
              href="https://vui.seriohub.com/sponsors/sponsors"
              target="_blank"
              //radius={8}
            >
              Learn More
            </Button>
            <Space h={50}/>

            <Text fw={500} fz="sm" mb={5}>
              🚀 If VUI has been helpful in your work, please consider supporting us to unlock exclusive <Anchor
                size="sm"
                fw={700}
                href="https://vui.seriohub.com/docs/guide/features/core" target="_blank">
                Core
              </Anchor> features and
              help drive future development.
            </Text>

            <Button
              component="a"
              color="red"
              leftSection={<IconHeart/>}
              href="https://github.com/sponsors/davideserio"
              target="_blank"
              // radius={8}
            >
              Become a Sponsor
            </Button>
          </Grid.Col>
          <Grid.Col span={2}>
            <Image h={120} w={120} src={image.src}/>
          </Grid.Col>
        </Grid>
        <Group justify="flex-end">
          <Text size="sm" mt={20}>
            🙏 Your support makes a real difference. Thank you!
          </Text>
        </Group>
      </Paper>
    </>
  );
}
