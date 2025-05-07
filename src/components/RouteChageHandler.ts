// 'use client';
//
// import { useEffect, useRef } from 'react';
// import { usePathname } from 'next/navigation';
// import { useSocketStatus } from '@/contexts/SocketContext';
// import { useAgentStatus } from "@/contexts/AgentContext";
//
// const RouteChangeHandler = () => {
//   const pathname = usePathname();
//   const socketValues = useSocketStatus();
//   const agentValues = useAgentStatus();
//   const prevPathnameRef = useRef<string | null>(null);
//
//   useEffect(() => {
//     if (prevPathnameRef.current !== pathname) {
//       prevPathnameRef.current = pathname;
//
//       const message = {
//         action: 'watch:clear',
//         agent_name: agentValues.currentAgent?.name,
//       };
//       socketValues.sendMessageToSocket(JSON.stringify(message));
//     }
//   }, [pathname]);
//
//   return null;
// };
//
// export default RouteChangeHandler;

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

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

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
  }, [pathname]);

  return null;
};

export default RouteChangeHandler;
