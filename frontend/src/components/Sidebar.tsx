import {useContext} from "react";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    IconButton,
    Divider,
    Tooltip,
    Avatar,
} from "@mui/material";
import {AuthContext} from "../store/auth-context";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import ExtensionIcon from '@mui/icons-material/Extension';
import MapIcon from '@mui/icons-material/Map';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

type SidebarProps = {
    collapsed: boolean;
    onToggleCollapse: () => void;
};

import TimelineIcon from '@mui/icons-material/Timeline';

const navItems = [
    {label: 'Dashboard', icon: <DashboardIcon/>, path: '/'},
    {label: 'Servers', icon: <DnsIcon/>, path: '/servers'},
    {label: 'Mods', icon: <ExtensionIcon/>, path: '/mods'},
    {label: 'Scenarios', icon: <MapIcon/>, path: '/scenarios'},
    {label: 'Monitoring', icon: <TimelineIcon/>, path: '/monitoring'},
    {label: 'Tools', icon: <BuildIcon/>, path: '/tools'},
    {label: 'Settings', icon: <SettingsIcon/>, path: '/settings'},
];

const Sidebar = ({collapsed, onToggleCollapse}: SidebarProps) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        authCtx.logout();
        navigate("/login");
    };

    const drawerWidth = collapsed ? 72 : 260;

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: 'rgba(12, 18, 32, 0.85)',
                    backdropFilter: 'blur(30px) saturate(200%)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.06)',
                    transition: 'width 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    p: collapsed ? '20px 12px' : '20px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minHeight: '72px',
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #00e87b 0%, #00b35f 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(0, 232, 123, 0.3)',
                    }}
                >
                    <SportsEsportsIcon sx={{color: '#06090f', fontSize: 22}}/>
                </Box>
                {!collapsed && (
                    <Stack sx={{animation: 'fadeIn 0.3s ease', overflow: 'hidden'}}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: '#f1f5f9',
                                letterSpacing: '-0.01em',
                                whiteSpace: 'nowrap',
                                lineHeight: 1.2,
                            }}
                        >
                            Centiria GSM
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#64748b',
                                fontSize: '0.7rem',
                                fontFamily: "'JetBrains Mono', monospace",
                                whiteSpace: 'nowrap',
                                lineHeight: 1.2,
                            }}
                        >
                            Game Server Manager
                        </Typography>
                    </Stack>
                )}
            </Box>

            <Divider sx={{borderColor: 'rgba(148, 163, 184, 0.06)', mx: collapsed ? 1 : 2}}/>

            {/* Navigation */}
            <List sx={{flex: 1, py: 1.5, px: collapsed ? 0.75 : 1}}>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <ListItem key={item.path} disablePadding sx={{mb: 0.25}}>
                            <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    sx={{
                                        minHeight: 44,
                                        borderRadius: '10px',
                                        mx: collapsed ? 0.5 : 0.5,
                                        px: collapsed ? 1.5 : 2,
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        backgroundColor: active ? 'rgba(0, 232, 123, 0.08)' : 'transparent',
                                        border: active ? '1px solid rgba(0, 232, 123, 0.15)' : '1px solid transparent',
                                        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: active ? 'rgba(0, 232, 123, 0.12)' : 'rgba(148, 163, 184, 0.06)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: collapsed ? 0 : 36,
                                            justifyContent: 'center',
                                            color: active ? '#00e87b' : '#64748b',
                                            transition: 'color 200ms ease',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '1.25rem',
                                            },
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {!collapsed && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight: active ? 600 : 400,
                                                color: active ? '#f1f5f9' : '#94a3b8',
                                                letterSpacing: '0.01em',
                                            }}
                                        />
                                    )}
                                    {active && !collapsed && (
                                        <Box
                                            sx={{
                                                width: 4,
                                                height: 20,
                                                borderRadius: '2px',
                                                background: 'linear-gradient(180deg, #00e87b, #00b35f)',
                                                boxShadow: '0 0 8px rgba(0, 232, 123, 0.4)',
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{borderColor: 'rgba(148, 163, 184, 0.06)', mx: collapsed ? 1 : 2}}/>

            {/* Bottom Section */}
            <Box sx={{p: collapsed ? '12px 8px' : '12px 16px'}}>
                {/* User Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        borderRadius: '10px',
                        mb: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                        }}
                    >
                        A
                    </Avatar>
                    {!collapsed && (
                        <Stack sx={{flex: 1, overflow: 'hidden'}}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    color: '#f1f5f9',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Admin
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#64748b',
                                    fontSize: '0.7rem',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                centiria.my
                            </Typography>
                        </Stack>
                    )}
                    {!collapsed && (
                        <Tooltip title="Log out" arrow>
                            <IconButton
                                size="small"
                                onClick={handleLogout}
                                sx={{
                                    color: '#64748b',
                                    '&:hover': {
                                        color: '#ef4444',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    },
                                }}
                            >
                                <LogoutIcon sx={{fontSize: '1.1rem'}}/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {/* Collapse Toggle */}
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton
                        onClick={onToggleCollapse}
                        size="small"
                        sx={{
                            color: '#64748b',
                            width: 32,
                            height: 32,
                            '&:hover': {
                                color: '#f1f5f9',
                                backgroundColor: 'rgba(148, 163, 184, 0.08)',
                            },
                        }}
                    >
                        {collapsed ? <ChevronRightIcon fontSize="small"/> : <ChevronLeftIcon fontSize="small"/>}
                    </IconButton>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
