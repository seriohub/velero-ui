'use client';

import React, { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';

import { useUIStatus } from '@/contexts/UIContext';
import { theme } from '../../theme';

export default function LayoutTheme({ children }: { children: any }) {

  return (
    <LayoutWithTheme>
      {children}
    </LayoutWithTheme>
  );
}

// Theme dynamic component
function LayoutWithTheme({ children }: { children: any }) {
  const {
    primaryColor,
    uiFontFamily,
    uiFontSize
  } = useUIStatus();
  useEffect(() => {
    if (uiFontSize) {
      document.documentElement.style.setProperty('--text-fz', uiFontSize?.fontSize);
    }
  }, [uiFontSize])

  return (
    <MantineProvider
      theme={{
        ...theme,
        primaryColor: primaryColor || 'blue',
        fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        ...(uiFontSize !== undefined && { fontSizes: uiFontSize?.fontSize }),
        headings: {
          // Use default theme if you want to provide default Mantine fonts as a fallback
          fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        },
        /*components: {
          Highlight: {
            styles: {
              root: {
                //fontSize: '14px',
                //fontFamily: 'Courier New',
              },
            },
          },
        },*/
      }}

    >
      {children}
    </MantineProvider>
  );
}
