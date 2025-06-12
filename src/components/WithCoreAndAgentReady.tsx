'use client';

import React, { useEffect, useState } from 'react';
import { Box, Center, Loader, Overlay } from "@mantine/core";

import { useAppStatus } from "@/contexts/AppContext";
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import { env } from 'next-runtime-env';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function WithCoreAndAgentReady({
                                                children,
                                                fallback
                                              }: Props) {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const appValues = useAppStatus();
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  const isReady =
    serverValues?.isServerAvailable &&
    serverValues?.isCurrentServerControlPlane !== undefined &&
    agentValues?.isAgentAvailable &&
    (appValues.isAuthenticated || !NEXT_PUBLIC_AUTH_ENABLED);

  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (isReady) {
      setRenderKey(prev => prev + 1);
    }
  }, [isReady]);

  return (
    <Box pos="relative" style={{ height: "100%" }} key={renderKey}>
      {children}
      {!isReady && (
        <>
          <Overlay
            blur={2}
            opacity={0.5}
            color="red"
            zIndex={10}
            h="100%"
          />
          <Center pos="absolute" top={0} left={0} w="100%" h="100%">
            {fallback ?? <Loader size="lg"/>}
          </Center>
        </>
      )}
    </Box>
  );
}

