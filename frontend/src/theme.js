import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: ['Inter', 'sans-serif'].join(","),
  fontSize: 12,
  h1: { fontSize: 40 },
  h2: { fontSize: 32 },
  h3: { fontSize: 24 },
  h4: { fontSize: 20 },
  h5: { fontSize: 16 },
  h6: { fontSize: 14 },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007BFF',
    },
    secondary: {
      main: '#6C757D',
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#000000',
    },
    common: {
      white: '#FFFFFF',
    },
  },
  typography: {
    ...baseTypography,
    pxToRem: (value) => `${value / 16}rem`, // Define the pxToRem function
  },
});

export default theme;
