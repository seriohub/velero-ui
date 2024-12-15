import DebAppContext from '@/components/Debug/DebContextApp/DebAppContext';

import DebServerContext from '@/components/Debug/DebContextServer/DebServerContext';
import DebUserContext from '@/components/Debug/DebContextUser/DebUserContext';

import { Box, Stack, Text } from '@mantine/core';

import React from 'react';
import DebAgentContext from './DebContextAgent/DebContextAgent';
import DebUIContext from './DebContextUI/DebUIContext';

export function DebAsideApp({ value, setValue }: any) {
  return (
    <>
      <Stack h="100%">
        <Box>
          <Text size="sm">Server Context</Text>
          <DebServerContext />
        </Box>
        <Box>
          <Text size="sm">App Context</Text>
          <DebAppContext />
        </Box>
        <Box>
          <Text size="sm">Agent Context</Text>
          <DebAgentContext />
        </Box>
        <Box>
          <Text size="sm">UI Context</Text>
          <DebUIContext />
        </Box>
        <Box>
          <Text size="sm">User Context</Text>
          <DebUserContext />
        </Box>
      </Stack>
    </>
  );
}
