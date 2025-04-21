import { redirect } from "next/dist/server/api-utils";

export const theme = {
  colors: {
    primary: {
      black: '#3A2E39',
      green: '#1E555C',
      beige: '#F4D8CD',
      sand: '#EDB183',
      pink: '#E4B7B7',
      darkBlue: '#2B2E6A',
      coral: '#E88D67',
      red: '#F15152',
    },
    secondary: {
      yellow: '#F4D03F',
      lightPink: '#FFF1F1',
    },
    text: {
      primary: '#3A2E39',
      secondary: '#64748B',
    },
    background: {
      main: '#F3E5E2',
      white: '#FFFFFF',
      gradient: 'linear-gradient(180deg,#f3e5e2 0%,rgb(233, 86, 73) 100%)',
    }
  },
  typography: {
    fontFamily: {
      primary: 'Manrope, sans-serif',
    },
    fontSize: {
      title: '72px',
      subtitle: '48px',
      header: '24px',
      body: '20px',
      small: '14px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  }
}
