'use client';

import PrimaryColorSwitch from './PrimaryColorSwitch';
import { UIConfigFontFamily } from './UIConfigFontFamily';
import { UIConfigFontSize } from './UIConfigFontSize';
import { UIConfigMainColored } from './UIConfigMainColored';
import { UIConfigNavbarColor } from './UIConfigNavbarColor';
import { UIConfigBadgeVariant } from "@/components/Features/Config/UI/UIConfigBadgeVariant";

export default function UIConfig() {
  return (
    <>
      <PrimaryColorSwitch/>
      <UIConfigNavbarColor/>
      <UIConfigMainColored/>
      <UIConfigFontFamily/>
      <UIConfigFontSize/>
      <UIConfigBadgeVariant/>
    </>
  );
}
