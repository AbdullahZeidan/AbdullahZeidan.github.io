import twColors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export const screens = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const

export const colors = {
    dark: 'hsl(0, 0%, 7%)',
    light: 'hsl(0, 0%, 100%)',
    brand: twColors.teal,
} as const

export const fontFamilies = {
    mono: ['var(--font-monospace)', 'Lucida Console', 'Monaco', 'monospace'],
    sans: ['var(--font-grotesk)', ...defaultTheme.fontFamily.sans],
} // not using `as const` because tailwind.config.js errors because of a type conflict

export type Color = keyof typeof colors
export type Screen = keyof typeof screens
export type FontFamily = keyof typeof fontFamilies
