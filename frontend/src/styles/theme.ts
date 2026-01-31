import { createTheme } from '@mui/material/styles';

// SUVIDHA Design System Theme for Material UI
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1a73e8',
            light: '#669df6',
            dark: '#174ea6',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#5f6368',
            light: '#80868b',
            dark: '#3c4043',
            contrastText: '#ffffff',
        },
        success: {
            main: '#34a853',
            light: '#5bb974',
            dark: '#1e8e3e',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#fbbc04',
            light: '#fcc934',
            dark: '#f9ab00',
            contrastText: '#000000',
        },
        error: {
            main: '#ea4335',
            light: '#ee675c',
            dark: '#d93025',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#202124',
            secondary: '#5f6368',
        },
        divider: '#dadce0',
    },
    typography: {
        fontFamily: "'Noto Sans', system-ui, -apple-system, sans-serif",
        h1: {
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: 1.25,
        },
        h3: {
            fontSize: '30px',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: 1.35,
        },
        h5: {
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.45,
        },
        body1: {
            fontSize: '16px',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '14px',
            lineHeight: 1.5,
        },
        button: {
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
        },
        caption: {
            fontSize: '12px',
            lineHeight: 1.4,
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    minHeight: '48px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                    },
                },
                sizeLarge: {
                    minHeight: '56px',
                    padding: '16px 32px',
                    fontSize: '18px',
                },
                containedPrimary: {
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
                    transition: 'box-shadow 250ms ease-in-out',
                    '&:hover': {
                        boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        minHeight: '56px',
                        fontSize: '16px',
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '16px',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    minHeight: '32px',
                    fontSize: '14px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px',
                    maxWidth: '90vw',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    minHeight: '56px',
                    fontSize: '16px',
                    fontWeight: 500,
                    textTransform: 'none',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    minWidth: '48px',
                    minHeight: '48px',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    minHeight: '56px',
                    borderRadius: '8px',
                    margin: '4px 8px',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    minWidth: '56px',
                    minHeight: '56px',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '14px',
                    padding: '8px 12px',
                },
            },
        },
    },
});

// High contrast theme for accessibility
export const highContrastTheme = createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        mode: 'light',
        primary: {
            main: '#0000ff',
            light: '#4444ff',
            dark: '#0000cc',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#333333',
        },
    },
});

// Dark theme for accessibility
export const darkTheme = createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        mode: 'dark',
        primary: {
            main: '#8ab4f8',
            light: '#aecbfa',
            dark: '#669df6',
            contrastText: '#000000',
        },
        background: {
            default: '#202124',
            paper: '#292a2d',
        },
        text: {
            primary: '#e8eaed',
            secondary: '#9aa0a6',
        },
    },
});
