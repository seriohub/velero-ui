import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

import { IconSun, IconMoon } from '@tabler/icons-react';

import cx from 'clsx';

import classes from './switch.module.css';

export default function SwitchColorScheme() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size={38}
      radius={8}
      aria-label="Toggle color scheme"
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={2} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={2} />
    </ActionIcon>
  );
}