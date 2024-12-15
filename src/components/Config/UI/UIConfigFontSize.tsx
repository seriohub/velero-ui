'use client';

import { rem, Select, Slider, Text, Box } from '@mantine/core';
import { useUIState } from '@/contexts/UIStateContext';

const marks = [
  { value: 0, label: 'xs' },
  { value: 25, label: 'sm' },
  { value: 50, label: 'md' },
  { value: 75, label: 'lg' },
  { value: 100, label: 'xl' },
];

// Map the slider values to corresponding font sizes
export const fontSizeMap = {
  0: {
    xs: rem(8),
    sm: rem(9),
    md: rem(10),
    lg: rem(11),
    xl: rem(12),
  },
  25: {
    xs: rem(10),
    sm: rem(11),
    md: rem(14),
    lg: rem(16),
    xl: rem(18),
  },
  50: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  75: {
    xs: rem(14),
    sm: rem(16),
    md: rem(18),
    lg: rem(20),
    xl: rem(22),
  },
  100: {
    xs: rem(16),
    sm: rem(18),
    md: rem(20),
    lg: rem(24),
    xl: rem(28),
  },
};

export type FontSizeKey = keyof typeof fontSizeMap;

export function UIConfigFontSize() {
  const appValues = useUIState();

  function setEndValue(endValue: FontSizeKey) {
    console.log('Selected font size mapping:', fontSizeMap[endValue]);

    // Update the app state with the selected font sizes
    appValues.setUiFontSize({ value: String(endValue), fontSize: fontSizeMap[endValue] });
    localStorage.setItem('fontSize', String(endValue));
  }

  return (
    <Box maw={400} mx="auto">
      <Text size="sm" mt={50} fw={500}>
        Font Size
      </Text>
      <Slider
        defaultValue={appValues?.uiFontSize?.value || 50}
        label={(val) => marks.find((mark) => mark.value === val)?.label || ''}
        step={25}
        marks={marks}
        onChangeEnd={(value) => setEndValue(value as FontSizeKey)} // Cast the number to string here
      />
    </Box>
  );
}

