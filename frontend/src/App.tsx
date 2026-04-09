import {ToastContainer} from "material-react-toastify";
import './App.css';
import Sidebar from "./components/Sidebar.tsx";
import {Route, Routes} from "react-router-dom";
import Login from "./components/auth/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ServersPage from "./pages/ServersPage.tsx";
import ServerSettingsPage from "./pages/ServerSettingsPage.tsx";
import ModsPage from "./pages/ModsPage.tsx";
import NewServerPage from "./pages/NewServerPage.tsx";
import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import 'material-react-toastify/dist/ReactToastify.css'
import ScenariosPage from "./pages/ScenariosPage.tsx";
import AppConfigPage from "./pages/AppConfigPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import MonitoringPage from "./pages/MonitoringPage.tsx";
import {useContext, useState} from "react";
import {AuthContext} from "./store/auth-context";

const App = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#00e87b',
                light: '#4dffaa',
                dark: '#00b35f',
                contrastText: '#06090f',
            },
            secondary: {
                main: '#38bdf8',
                light: '#7dd3fc',
                dark: '#0284c7',
            },
            error: {
                main: '#ef4444',
                light: '#fca5a5',
                dark: '#dc2626',
            },
            warning: {
                main: '#f59e0b',
                light: '#fcd34d',
                dark: '#d97706',
            },
            info: {
                main: '#818cf8',
                light: '#a5b4fc',
                dark: '#6366f1',
            },
            success: {
                main: '#00e87b',
                light: '#4dffaa',
                dark: '#00b35f',
            },
            background: {
                default: '#06090f',
                paper: '#111827',
            },
            text: {
                primary: '#f1f5f9',
                secondary: '#94a3b8',
            },
            divider: 'rgba(148, 163, 184, 0.08)',
        },
        typography: {
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            h1: {
                fontWeight: 700,
                letterSpacing: '-0.02em',
            },
            h2: {
                fontWeight: 700,
                letterSpacing: '-0.02em',
            },
            h3: {
                fontWeight: 600,
                letterSpacing: '-0.01em',
            },
            h4: {
                fontWeight: 600,
                letterSpacing: '-0.01em',
            },
            h5: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 600,
            },
            subtitle1: {
                color: '#94a3b8',
            },
            subtitle2: {
                color: '#94a3b8',
                fontWeight: 500,
            },
            body2: {
                color: '#94a3b8',
            },
            button: {
                fontWeight: 600,
                textTransform: 'none' as const,
                letterSpacing: '0.01em',
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#06090f',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '10px',
                        padding: '8px 20px',
                        fontSize: '0.875rem',
                        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 16px rgba(0, 232, 123, 0.25)',
                        },
                    },
                    containedPrimary: {
                        background: 'linear-gradient(135deg, #00e87b 0%, #00b35f 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4dffaa 0%, #00e87b 100%)',
                        },
                    },
                    outlined: {
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                        '&:hover': {
                            borderColor: '#00e87b',
                            backgroundColor: 'rgba(0, 232, 123, 0.05)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: 'rgba(17, 24, 39, 0.7)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(148, 163, 184, 0.08)',
                        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: 'rgba(17, 24, 39, 0.6)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(148, 163, 184, 0.08)',
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            borderColor: 'rgba(0, 232, 123, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            transform: 'translateY(-2px)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                                borderColor: 'rgba(148, 163, 184, 0.12)',
                                transition: 'border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(148, 163, 184, 0.25)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#00e87b',
                                borderWidth: '1.5px',
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 0 0 3px rgba(0, 232, 123, 0.1)',
                            },
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
                        padding: '16px 20px',
                    },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        transition: 'background-color 200ms ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 232, 123, 0.03)',
                        },
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none' as const,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        minHeight: '48px',
                        transition: 'all 250ms ease',
                        '&.Mui-selected': {
                            fontWeight: 600,
                        },
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        height: '2.5px',
                        borderRadius: '2px',
                        background: 'linear-gradient(90deg, #00e87b, #38bdf8)',
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: '10px',
                        border: '1px solid',
                    },
                    standardError: {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                    },
                    standardWarning: {
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderColor: 'rgba(245, 158, 11, 0.2)',
                    },
                    standardSuccess: {
                        backgroundColor: 'rgba(0, 232, 123, 0.1)',
                        borderColor: 'rgba(0, 232, 123, 0.2)',
                    },
                    standardInfo: {
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        borderColor: 'rgba(56, 189, 248, 0.2)',
                    },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: '6px',
                        height: '6px',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    },
                    bar: {
                        borderRadius: '6px',
                        background: 'linear-gradient(90deg, #00e87b 0%, #38bdf8 100%)',
                    },
                },
            },
            MuiCircularProgress: {
                styleOverrides: {
                    root: {
                        strokeLinecap: 'round',
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00e87b',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00e87b',
                            opacity: 0.5,
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        fontWeight: 500,
                    },
                },
            },
            MuiModal: {
                styleOverrides: {
                    root: {
                        '& .MuiBackdrop-root': {
                            backgroundColor: 'rgba(6, 9, 15, 0.8)',
                            backdropFilter: 'blur(8px)',
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        padding: '8px 12px',
                    },
                },
            },
            MuiSkeleton: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgba(148, 163, 184, 0.08)',
                    },
                },
            },
        },
    });

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {isLoggedIn && (
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
                    />
                )}
                <Box
                    component="main"
                    sx={{
                        ml: isLoggedIn ? (sidebarCollapsed ? '72px' : '260px') : 0,
                        p: isLoggedIn ? { xs: 2, sm: 3, md: 4 } : 0,
                        minHeight: '100vh',
                        transition: 'margin-left 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Routes>
                        <Route index element={
                            <ProtectedRoute><DashboardPage/></ProtectedRoute>
                        }/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="servers" element={
                            <ProtectedRoute><ServersPage/></ProtectedRoute>
                        }/>
                        <Route path="servers/new/:type" element={
                            <ProtectedRoute><NewServerPage/></ProtectedRoute>
                        }/>
                        <Route path="servers/:id" element={
                            <ProtectedRoute><ServerSettingsPage/></ProtectedRoute>
                        }/>
                        <Route path="scenarios" element={
                            <ProtectedRoute><ScenariosPage/></ProtectedRoute>
                        }/>
                        <Route path="mods/:section" element={
                            <ProtectedRoute><ModsPage/></ProtectedRoute>
                        }/>
                        <Route path="mods" element={
                            <ProtectedRoute><ModsPage/></ProtectedRoute>
                        }/>
                        <Route path="tools" element={
                            <ProtectedRoute><ToolsPage/></ProtectedRoute>
                        }/>
                        <Route path="monitoring" element={
                            <ProtectedRoute><MonitoringPage/></ProtectedRoute>
                        }/>
                        <Route path="settings" element={
                            <ProtectedRoute><AppConfigPage/></ProtectedRoute>
                        }/>
                    </Routes>
                </Box>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    toastStyle={{
                        backgroundColor: '#1e293b',
                        color: '#f1f5f9',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        backdropFilter: 'blur(20px)',
                        fontFamily: "'Inter', sans-serif",
                    }}
                />
            </ThemeProvider>
        </>
    );
}

export default App;
