"use client"

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
// Removed import of useColorMode from @chakra-ui/system or @chakra-ui/react
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark" | "green"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode | "system") => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme(); // from next-themes

  const setColorMode = React.useCallback((newTheme: ColorMode | "system") => {
    setTheme(newTheme);
  }, [setTheme]);

  const toggleColorMode = React.useCallback(() => {
    // This toggle treats "green" as a light theme.
    // So, if current is "green" (resolvedTheme might be "green" or "light" if system is light)
    // or "light", it toggles to "dark".
    // If current is "dark", it toggles to "light".
    const currentIsEffectivelyLight = resolvedTheme === "light" || resolvedTheme === "green";
    setTheme(currentIsEffectivelyLight ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode(); // Uses the custom hook defined in this file

  // If green theme is active, treat it as a light theme for value selection
  if (colorMode === "green") {
    return light;
  }
  // If dark theme is active, return dark value
  if (colorMode === "dark") {
    return dark;
  }
  // Default to light for "light" theme or any other unhandled cases (e.g. "system" resolved to light)
  return light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)
