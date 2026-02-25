import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { store, RootState } from './store';
import { theme, darkTheme, highContrastTheme } from './styles/theme';
import './styles/index.css';
import './i18n';

const DynamicThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const contrastMode = useSelector((state: RootState) => state.ui.contrastMode);
    const activeTheme = contrastMode === 'dark' ? darkTheme
        : contrastMode === 'high' ? highContrastTheme
            : theme;
    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <DynamicThemeProvider>
                    <App />
                </DynamicThemeProvider>
            </HashRouter>
        </Provider>
    </React.StrictMode>
);
