"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// 1. Import the specific type definition
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // 2. The error is expected because `dist` paths don't exist at build time.
  // We tell TypeScript to ignore this specific import path.
  // eslint-disable-next-line import/no-unresolved
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}