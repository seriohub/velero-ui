'use client';

import { Open_Sans } from 'next/font/google';
import { createTheme, Loader } from '@mantine/core';
import { RingLoader } from './src/components/RingLoader';

const open_sans = Open_Sans({ subsets: ['latin'] });

export const theme = createTheme({
  /* Put your mantine theme override here */
  fontFamily: open_sans.style.fontFamily,
  // fontFamilyMonospace: 'Monaco, Courier, monospace',
  // headings: { fontFamily: 'Greycliff CF, sans-serif' },
  // Font sizes in px, other units are not supported
  /*fontSizes: {
      xs: '10',
      sm: '12',
      md: '14',
      lg: '16',
      xl: '20',
  },*/
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: {
          ...Loader.defaultLoaders,
          ring: RingLoader,
        },
        type: 'ring',
      },
    }),
  },
});
