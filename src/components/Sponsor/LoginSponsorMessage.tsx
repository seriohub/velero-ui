'use client';
import {
  Text,
  Anchor,
  Paper,
  Space,
  Group,
  Box,
  Grid,
  Center,
  useComputedColorScheme,
} from '@mantine/core';
import { Button, Image, TextInput, Title } from '@mantine/core';
import image from './donate.svg';
import { useColorScheme } from '@mantine/hooks';
import { IconHeart } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function LoginSponsorMessage() {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [init, setInit] = useState(false);
  useEffect(() => {
    console.log("----", computedColorScheme)
    setInit(true);
  }, [computedColorScheme]);

  if (!init) return <></>;
console.log(computedColorScheme)
  return (
    <>
      <Paper
        shadow="xs"
        p="xl"
        withBorder
        maw="800"
        bg={computedColorScheme == 'light' ? '#f2f3f5' : '#1f1f1f'}
      >
        <Grid>
          <Grid.Col span={9}>
            <Title order={3}>Wait a minute...</Title>
            <Text fw={500} fz="md" mb={5}>
              A thank you to our sponsors and one-time donors for their generous support!
            </Text>

            <Button
              component="a"
              /*leftSection={<IconHeart />}*/
              //h={40}
              href="https://vui.seriohub.com/docs/sponsors"
              target="_blank"
              //radius={8}
            >
              Learn More
            </Button>
            <Space h={50} />

            <Text fw={500} fz="sm" mb={5}>
              This software is built during late nights, stolen weekends, and the occasional "I'll
              just fix one more bug" moment. If you've found it helpful in your work, please
              consider supporting its development with a contribution - because caffeine isn't free,
              and neither are all these therapy sessions with my code.
            </Text>

            <Button
              component="a"
              color="red"
              leftSection={<IconHeart />}
              href="https://github.com/sponsors/davideserio"
              target="_blank"
              //radius={8}
            >
              Become a Sponsor
            </Button>
          </Grid.Col>
          <Grid.Col span={3}>
            <Image h={120} w={120} src={image.src} />
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}
