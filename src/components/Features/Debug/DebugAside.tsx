import React from 'react';
import { Box, Stack, Text } from '@mantine/core';

import DebugContextAgent from './Context/DebugContextAgent';
import DebUIContext from './Context/DebugUIContext';
import DebugLoggerContext from './Context/DebugLoggerContext';
import DebugSocketContext from './Context/DebugSocketContext';

import DebugAppContext from '@/components/Features/Debug/Context/DebugAppContext';
import DebugServerContext from '@/components/Features/Debug/Context/DebugServerContext';
import DebugUserContext from '@/components/Features/Debug/Context/DebugUserContext';

export default function DebugAside() {
  return (
    <>
      <Stack h="100%">
        <Box>
          <Text size="sm">Logger Context</Text>
          <DebugLoggerContext />
        </Box>
        <Box>
          <Text size="sm">UI Context</Text>
          <DebUIContext />
        </Box>
        <Box>
          <Text size="sm">App Context</Text>
          <DebugAppContext />
        </Box>
        <Box>
          <Text size="sm">Server Context</Text>
          <DebugServerContext />
        </Box>
        <Box>
          <Text size="sm">Agent Context</Text>
          <DebugContextAgent />
        </Box>
        <Box>
          <Text size="sm">Socket Context</Text>
          <DebugSocketContext />
        </Box>
        <Box>
          <Text size="sm">User Context</Text>
          <DebugUserContext />
        </Box>
      </Stack>
    </>
  );
}
