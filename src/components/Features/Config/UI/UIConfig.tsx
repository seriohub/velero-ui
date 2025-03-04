'use client';

import PrimaryColorSwitch from './PrimaryColorSwitch';
import { UIConfigFontFamily } from './UIConfigFontFamily';
import { UIConfigFontSize } from './UIConfigFontSize';
import { UIConfigMainColored } from './UIConfigMainColored';
import { UIConfigNavbarColor } from './UIConfigNavbarColor';

export default function UIConfig() {
  return (
    <>
      <PrimaryColorSwitch />
      <UIConfigNavbarColor />
      <UIConfigMainColored />
      <UIConfigFontFamily />
      <UIConfigFontSize />
    </>
  );
}
