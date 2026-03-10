"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <NextThemeProvider
      attribute='class'
      defaultTheme='system' // follows OS/browser preference
      enableSystem
      storageKey='theme' // persists user theme choice
      enableColorScheme={false} // syncs color-scheme meta
    >
      {children}
    </NextThemeProvider>
  );
}
