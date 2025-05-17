'use client';

import React from 'react';
import { MantineProvider } from '@mantine/core';

import { ContextMenuProvider } from 'mantine-contextmenu';

import '../styles/fonts.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'mantine-contextmenu/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { theme } from '../../theme';

import './layout.css';

import { useUIStatus } from '@/contexts/UIContext';

export default function LayoutTheme({ children }: { children: any }) {

  return (

    <LayoutWithTheme>
      <ContextMenuProvider>{children}</ContextMenuProvider>
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

  return (
    <MantineProvider
      theme={{
        ...theme,
        primaryColor: primaryColor || 'blue',
        //fontFamily: uiFontFamily.fontFamily?.style?.fontFamily,
        fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        ...(uiFontSize !== undefined && { fontSizes: uiFontSize?.fontSize }),
        headings: {
          // Use default theme if you want to provide default Mantine fonts as a fallback
          fontFamily: `${uiFontFamily.fontFamily}, sans-serif`,
        },
      }}
    >
      <ContextMenuProvider>{children}</ContextMenuProvider>
    </MantineProvider>
  );
}
