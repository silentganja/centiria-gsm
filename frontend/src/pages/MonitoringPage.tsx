import {useEffect, useState, useRef} from "react";
import {
    Box,
    Chip,
    Grid,
    IconButton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    InputAdornment,
    LinearProgress,
    Switch,
    FormControlLabel,
} from "@mui/material";
import {getSystemInfo} from "../services/systemService";
import {getServers, getServerStatus} from "../services/serversService";
import {useInterval} from "../hooks/use-interval";
import {humanFileSize} from "../util/util.ts";
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {ServerDto} from "../dtos/ServerDto";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ActivityEvent {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    source: string;
}


// ─── Activity Log Storage ───────────────────────────────────────────────────

const ACTIVITY_STORAGE_KEY = 'centiria_gsm_activity_log';
const MAX_EVENTS = 100;

const getStoredEvents = (): ActivityEvent[] => {
    try {
        const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored).map((e: ActivityEvent) => ({...e, timestamp: new Date(e.timestamp)}));
    } catch {
        return [];
    }
};

const saveEvents = (events: ActivityEvent[]) => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
};

const addEvent = (events: ActivityEvent[], type: ActivityEvent['type'], message: string, source: string): ActivityEvent[] => {
    const newEvent: ActivityEvent = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        type,
        message,
        timestamp: new Date(),
        source,
    };
    const updated = [newEvent, ...events].slice(0, MAX_EVENTS);
    saveEvents(updated);
    return updated;
};

// ─── Metric Card ────────────────────────────────────────────────────────────

const LiveMetricCard = ({icon, label, value, unit, trend, color}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    color: string;
}) => (
    <Box
        sx={{
            p: 2,
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.06)',
            transition: 'all 200ms ease',
            '&:hover': {borderColor: `${color}30`},
        }}
    >
        <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{color, display: 'flex', '& .MuiSvgIcon-root': {fontSize: '1rem'}}}>
                        {icon}
                    </Box>
                    <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                        {label}
                    </Typography>
                </Stack>
                {trend && trend !== 'stable' && (
                    <Box sx={{color: trend === 'up' ? '#f59e0b' : '#00e87b', display: 'flex'}}>
                        {trend === 'up' ? <ArrowUpwardIcon sx={{fontSize: '0.85rem'}}/> : <ArrowDownwardIcon sx={{fontSize: '0.85rem'}}/>}
                    </Box>
                )}
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: '#f1f5f9',
                    lineHeight: 1,
                }}>
                    {value}
                </Typography>
                {unit && (
                    <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem'}}>
                        {unit}
                    </Typography>
                )}
            </Stack>
        </Stack>
    </Box>
);

// ─── Mini Sparkline ─────────────────────────────────────────────────────────

const MiniSparkline = ({data, color, height = 40}: {data: number[]; color: string; height?: number}) => {
    if (data.length < 2) return null;

    const width = 200;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sparkline-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#sparkline-grad-${color.replace('#', '')})`}/>
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

// ─── Main Page ──────────────────────────────────────────────────────────────

const MonitoringPage = () => {
    const [tab, setTab] = useState(0);
    const [events, setEvents] = useState<ActivityEvent[]>(getStoredEvents());
    const [eventFilter, setEventFilter] = useState("");
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Live metrics
    const [cpuUsage, setCpuUsage] = useState(0);
    const [memoryUsed, setMemoryUsed] = useState(0);
    const [memoryTotal, setMemoryTotal] = useState(0);
    const [storageUsed, setStorageUsed] = useState(0);
    const [storageTotal, setStorageTotal] = useState(0);
    const [cpuCount, setCpuCount] = useState(0);

    // Sparkline history
    const [cpuHistory, setCpuHistory] = useState<number[]>([]);
    const [memHistory, setMemHistory] = useState<number[]>([]);

    // Server stats
    const [totalServers, setTotalServers] = useState(0);
    const [onlineServers, setOnlineServers] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);

    // Previous values for trend
    const prevCpu = useRef(0);
    const prevMem = useRef(0);

    useEffect(() => {
        fetchMetrics();
        fetchServerStats();
        setEvents(prev => addEvent(prev, 'info', 'Monitoring page opened', 'System'));
    }, []);

    useInterval(() => {
        if (autoRefresh) {
            fetchMetrics();
        }
    }, 3000);

    useInterval(() => {
        if (autoRefresh) {
            fetchServerStats();
        }
    }, 15000);

    const fetchMetrics = async () => {
        try {
            const {data: info} = await getSystemInfo();
            const cpu = Math.round(info.cpuUsage * 100);
            const memUsed = info.memoryTotal - info.memoryLeft;
            const memPct = Math.round((memUsed / info.memoryTotal) * 100);
            const stoUsed = info.spaceTotal - info.spaceLeft;

            prevCpu.current = cpuUsage;
            prevMem.current = Math.round(((memoryTotal - (memoryTotal - memoryUsed)) / (memoryTotal || 1)) * 100);

            setCpuUsage(cpu);
            setMemoryUsed(memUsed);
            setMemoryTotal(info.memoryTotal);
            setStorageUsed(stoUsed);
            setStorageTotal(info.spaceTotal);
            setCpuCount(info.cpuCount);

            setCpuHistory(prev => [...prev.slice(-29), cpu]);
            setMemHistory(prev => [...prev.slice(-29), memPct]);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchServerStats = async () => {
        try {
            const {data: serversData} = await getServers();
            const servers: ServerDto[] = serversData.servers;
            setTotalServers(servers.length);

            let online = 0;
            let players = 0;
            for (const server of servers) {
                if (server.id == null) continue;
                try {
                    const {data: status} = await getServerStatus(server.id);
                    if (status && status.alive) {
                        online++;
                        players += status.playersOnline || 0;
                    }
                } catch { /* ignore */ }
            }
            setOnlineServers(online);
            setTotalPlayers(players);
        } catch (e) {
            console.error(e);
        }
    };

    const getCpuTrend = (): 'up' | 'down' | 'stable' => {
        if (cpuUsage > prevCpu.current + 5) return 'up';
        if (cpuUsage < prevCpu.current - 5) return 'down';
        return 'stable';
    };

    const handleClearActivity = () => {
        setEvents([]);
        localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    };

    const filteredEvents = events.filter(e =>
        e.message.toLowerCase().includes(eventFilter.toLowerCase()) ||
        e.source.toLowerCase().includes(eventFilter.toLowerCase())
    );

    const getEventColor = (type: ActivityEvent['type']) => {
        switch (type) {
            case 'success': return '#00e87b';
            case 'warning': return '#f59e0b';
            case 'error': return '#ef4444';
            default: return '#38bdf8';
        }
    };

    const memPct = memoryTotal > 0 ? Math.round((memoryUsed / memoryTotal) * 100) : 0;
    const stoPct = storageTotal > 0 ? Math.round((storageUsed / storageTotal) * 100) : 0;

    return (
        <Box className="page-content">
            {/* Header */}
            <Stack spacing={0.5} mb={3}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Monitoring
                    </Typography>
                    <TimelineIcon sx={{color: '#64748b'}}/>
                </Stack>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Real-time system performance, server status, and activity log
                </Typography>
            </Stack>

            {/* Tabs */}
            <Box
                sx={{
                    borderRadius: '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    overflow: 'hidden',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{px: 2, pt: 1}}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                        <Tab label="Live Metrics"/>
                        <Tab label="Activity Log"/>
                        <Tab label="Server Status"/>
                    </Tabs>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                checked={autoRefresh}
                                onChange={(_, c) => setAutoRefresh(c)}
                            />
                        }
                        label={
                            <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem'}}>
                                Auto-refresh
                            </Typography>
                        }
                        sx={{mr: 1}}
                    />
                </Stack>

                <Box sx={{p: {xs: 2, md: 3}}}>
                    {/* Tab 0: Live Metrics */}
                    {tab === 0 && (
                        <Stack spacing={3}>
                            {/* Metric Cards */}
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                    <LiveMetricCard icon={<SpeedIcon/>} label="CPU Usage" value={cpuUsage} unit="%" trend={getCpuTrend()} color="#00e87b"/>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LiveMetricCard icon={<MemoryIcon/>} label="Memory" value={memPct} unit="%" color="#38bdf8"/>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LiveMetricCard icon={<StorageIcon/>} label="Storage" value={stoPct} unit="%" color="#818cf8"/>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LiveMetricCard icon={<DnsIcon/>} label="Servers" value={`${onlineServers}/${totalServers}`} unit="online" color="#f59e0b"/>
                                </Grid>
                            </Grid>

                            {/* Sparkline Charts */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{p: 2, borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)'}}>
                                        <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block'}}>
                                            CPU History (last 30 samples)
                                        </Typography>
                                        <MiniSparkline data={cpuHistory} color="#00e87b" height={60}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{p: 2, borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)'}}>
                                        <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block'}}>
                                            Memory History (last 30 samples)
                                        </Typography>
                                        <MiniSparkline data={memHistory} color="#38bdf8" height={60}/>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Detailed Resource Bars */}
                            <Box sx={{p: 2.5, borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)'}}>
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block'}}>
                                    Resource Details
                                </Typography>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption" sx={{color: '#94a3b8', fontSize: '0.75rem'}}>CPU ({cpuCount} cores)</Typography>
                                            <Typography variant="caption" sx={{color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem'}}>{cpuUsage}%</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={cpuUsage} sx={{height: 6, borderRadius: '3px', '& .MuiLinearProgress-bar': {background: cpuUsage >= 90 ? '#ef4444' : cpuUsage >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #00e87b, #38bdf8)'}}}/>
                                    </Box>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption" sx={{color: '#94a3b8', fontSize: '0.75rem'}}>Memory</Typography>
                                            <Typography variant="caption" sx={{color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem'}}>{humanFileSize(memoryUsed)} / {humanFileSize(memoryTotal)}</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={memPct} sx={{height: 6, borderRadius: '3px', '& .MuiLinearProgress-bar': {background: memPct >= 90 ? '#ef4444' : memPct >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #38bdf8, #818cf8)'}}}/>
                                    </Box>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption" sx={{color: '#94a3b8', fontSize: '0.75rem'}}>Storage</Typography>
                                            <Typography variant="caption" sx={{color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem'}}>{humanFileSize(storageUsed)} / {humanFileSize(storageTotal)}</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={stoPct} sx={{height: 6, borderRadius: '3px', '& .MuiLinearProgress-bar': {background: stoPct >= 90 ? '#ef4444' : stoPct >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #818cf8, #c084fc)'}}}/>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    {/* Tab 1: Activity Log */}
                    {tab === 1 && (
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <TextField
                                    size="small"
                                    placeholder="Search events..."
                                    value={eventFilter}
                                    onChange={(e) => setEventFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{color: '#64748b', fontSize: '1rem'}}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{maxWidth: 300}}
                                />
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={`${events.length} events`}
                                        size="small"
                                        sx={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: '0.7rem',
                                            backgroundColor: 'rgba(148, 163, 184, 0.08)',
                                            color: '#94a3b8',
                                        }}
                                    />
                                    <Tooltip title="Clear all events" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={handleClearActivity}
                                            sx={{color: '#64748b', '&:hover': {color: '#ef4444'}}}
                                        >
                                            <DeleteSweepIcon sx={{fontSize: '1.1rem'}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            {/* Event List */}
                            <Box
                                sx={{
                                    borderRadius: '10px',
                                    border: '1px solid rgba(148, 163, 184, 0.06)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    maxHeight: 500,
                                    overflow: 'auto',
                                }}
                            >
                                {filteredEvents.length === 0 ? (
                                    <Box sx={{p: 4, textAlign: 'center'}}>
                                        <NotificationsIcon sx={{fontSize: '2rem', color: '#334155', mb: 1}}/>
                                        <Typography variant="body2" sx={{color: '#475569'}}>
                                            {eventFilter ? 'No events match your search' : 'No activity events yet'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <Stack
                                            key={event.id}
                                            direction="row"
                                            alignItems="flex-start"
                                            spacing={1.5}
                                            sx={{
                                                p: 1.5,
                                                px: 2,
                                                borderBottom: '1px solid rgba(148, 163, 184, 0.04)',
                                                '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.03)'},
                                                '&:last-child': {borderBottom: 'none'},
                                            }}
                                        >
                                            <FiberManualRecordIcon sx={{fontSize: '0.5rem', color: getEventColor(event.type), mt: 0.6, flexShrink: 0}}/>
                                            <Stack sx={{flex: 1, minWidth: 0}}>
                                                <Typography variant="body2" sx={{fontSize: '0.8rem', color: '#f1f5f9'}}>
                                                    {event.message}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="caption" sx={{color: '#475569', fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace"}}>
                                                        {new Date(event.timestamp).toLocaleTimeString()}
                                                    </Typography>
                                                    <Chip
                                                        label={event.source}
                                                        size="small"
                                                        sx={{
                                                            height: 16,
                                                            fontSize: '0.6rem',
                                                            backgroundColor: 'rgba(148, 163, 184, 0.06)',
                                                            color: '#64748b',
                                                        }}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))
                                )}
                            </Box>
                        </Stack>
                    )}

                    {/* Tab 2: Server Status */}
                    {tab === 2 && (
                        <Stack spacing={2.5}>
                            {/* Summary Cards */}
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <LiveMetricCard icon={<DnsIcon/>} label="Total Servers" value={totalServers} color="#818cf8"/>
                                </Grid>
                                <Grid item xs={4}>
                                    <LiveMetricCard icon={<DnsIcon/>} label="Online" value={onlineServers} color="#00e87b"/>
                                </Grid>
                                <Grid item xs={4}>
                                    <LiveMetricCard icon={<PeopleIcon/>} label="Players" value={totalPlayers} color="#38bdf8"/>
                                </Grid>
                            </Grid>

                            {/* Uptime Info */}
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: '12px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(148, 163, 184, 0.06)',
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <AccessTimeIcon sx={{fontSize: '1rem', color: '#64748b'}}/>
                                    <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                        System Uptime
                                    </Typography>
                                </Stack>
                                <Typography sx={{fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', color: '#f1f5f9'}}>
                                    {new Date().toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{color: '#64748b', mt: 0.5, display: 'block'}}>
                                    Monitoring since page load. Keep this page open for continuous tracking.
                                </Typography>
                            </Box>

                            {/* Server Health Indicator */}
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: '12px',
                                    background: onlineServers > 0
                                        ? 'rgba(0, 232, 123, 0.05)'
                                        : totalServers > 0
                                            ? 'rgba(245, 158, 11, 0.05)'
                                            : 'rgba(15, 23, 42, 0.5)',
                                    border: `1px solid ${onlineServers > 0
                                        ? 'rgba(0, 232, 123, 0.15)'
                                        : totalServers > 0
                                            ? 'rgba(245, 158, 11, 0.15)'
                                            : 'rgba(148, 163, 184, 0.06)'}`,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: onlineServers > 0 ? '#00e87b' : totalServers > 0 ? '#f59e0b' : '#475569',
                                            boxShadow: onlineServers > 0 ? '0 0 12px rgba(0, 232, 123, 0.4)' : 'none',
                                            animation: onlineServers > 0 ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                                        }}
                                    />
                                    <Stack>
                                        <Typography variant="subtitle2" sx={{fontWeight: 600, color: '#f1f5f9'}}>
                                            {onlineServers > 0 ? 'Systems Operational' : totalServers > 0 ? 'All Servers Offline' : 'No Servers Configured'}
                                        </Typography>
                                        <Typography variant="caption" sx={{color: '#64748b'}}>
                                            {onlineServers > 0
                                                ? `${onlineServers} server${onlineServers > 1 ? 's' : ''} running, ${totalPlayers} player${totalPlayers !== 1 ? 's' : ''} connected`
                                                : totalServers > 0
                                                    ? 'Start a server from the Servers page'
                                                    : 'Create your first server to get started'
                                            }
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default MonitoringPage;
