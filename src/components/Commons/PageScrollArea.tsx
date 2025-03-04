import { ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function PageScrollArea({ children }: any) {
  const isNavbarVisible = useMediaQuery('(max-width: 576px)');
  return (
    <ScrollArea
      p={isNavbarVisible ? 2 : 10}
      h="100%"
      scrollbars="y"
      w={
        isNavbarVisible ? 'calc(100vw - 5px)' : 'calc(100vw - var(--app-shell-navbar-width))'
      }
    >
      {children}
    </ScrollArea>
  );
}
