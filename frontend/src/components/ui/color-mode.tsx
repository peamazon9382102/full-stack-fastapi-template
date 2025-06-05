"use client"

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import { useColorMode as useChakraNativeColorMode } from "@chakra-ui/system";
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
  const { setColorMode: setChakraColorModeInternal } = useChakraNativeColorMode();
  const { theme: currentNextTheme, resolvedTheme, setTheme: setNextTheme } = useTheme();

  React.useEffect(() => {
    if (resolvedTheme === "green") {
      setChakraColorModeInternal("light");
    } else if (resolvedTheme === "dark") {
      setChakraColorModeInternal("dark");
    } else if (resolvedTheme === "light") {
      setChakraColorModeInternal("light");
    }
    // Not explicitly handling "system" here, as resolvedTheme will be light/dark
  }, [resolvedTheme, setChakraColorModeInternal]);

  const setTheme = React.useCallback((newTheme: ColorMode | "system") => {
    setNextTheme(newTheme);
    // The useEffect above will handle syncing Chakra's mode.
    // If newTheme is 'green', Chakra will become 'light'.
    // If newTheme is 'light', Chakra will become 'light'.
    // If newTheme is 'dark', Chakra will become 'dark'.
    // If newTheme is 'system', next-themes resolves it, then useEffect syncs.
  }, [setNextTheme]);

  const toggleColorMode = React.useCallback(() => {
    // Toggles between light and dark. If current is green, it's treated as light by next-themes for toggling.
    // So if green (resolved to light for toggle), goes to dark. If dark, goes to light.
    const targetTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(targetTheme);
  }, [resolvedTheme, setTheme]);

  return {
    colorMode: resolvedTheme as ColorMode, // This can be 'green'
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  // If the current theme is "green", we want to use the "light" values for useColorModeValue.
  // The actual green styling is handled by CSS variables targeting html.green.
  // Chakra's internal mode will be 'light' when 'green' is active.
  return colorMode === "dark" ? dark : light
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
