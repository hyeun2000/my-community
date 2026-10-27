import { createTheme } from '@mui/material/styles';

/**
 * 달려~! 달려~! 테마
 * - primary: 짙은 브라운 (메인 컬러)
 * - secondary: 오렌지 (다이나믹한 포인트 컬러)
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#4E342E',
      light: '#7B5E57',
      dark: '#2B1A15',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF8F00',
      light: '#FFC046',
      dark: '#C56000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF6F2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E2723',
      secondary: '#8D6E63',
    },
    divider: '#EADFD8',
  },
  typography: {
    fontFamily: '"Roboto", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
