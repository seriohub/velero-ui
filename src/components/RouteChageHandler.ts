'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSocketStatus } from '@/contexts/SocketContext';
import { useAgentStatus } from "@/contexts/AgentContext";

const RouteChangeHandler = () => {
  const pathname = usePathname();
  const socketValues = useSocketStatus();
  const agentValues = useAgentStatus();
  const prevPathnameRef = useRef<string | null>(null);
  const prevCurrentAgentRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname || prevCurrentAgentRef.current !== agentValues.currentAgent?.name) {
      prevPathnameRef.current = pathname;
      prevCurrentAgentRef.current = agentValues.currentAgent?.name || null;

      const message = {
        type: 'watch_clear',
        kind: 'command',
        payload: {
          agent_name: agentValues.currentAgent?.name,
        },
        request_id: `req-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      socketValues.sendMessageToSocket(JSON.stringify(message));
    }
  }, [pathname, agentValues.currentAgent?.name]);

  return null;
};

export default RouteChangeHandler;
