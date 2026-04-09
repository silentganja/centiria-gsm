import {useEffect, useState} from "react";
import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {getSystemInfo} from "../../services/systemService";
import {useInterval} from "../../hooks/use-interval";
import {humanFileSize} from "../../util/util";
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import ComputerIcon from '@mui/icons-material/Computer';

type GaugeProps = {
    value: number;
    label: string;
    icon: React.ReactNode;
    detail: string;
    color: string;
    secondColor: string;
};

const AnimatedGauge = ({value, label, icon, detail, color, secondColor}: GaugeProps) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    const getStatusColor = (pct: number) => {
        if (pct >= 90) return '#ef4444';
        if (pct >= 70) return '#f59e0b';
        return color;
    };

    const activeColor = getStatusColor(value);

    return (
        <Stack alignItems="center" spacing={1.5}>
            <Box sx={{position: 'relative', width: 100, height: 100}}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
                    {/* Track */}
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.08)"
                        strokeWidth="6"
                    />
                    {/* Progress */}
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke={`url(#gauge-gradient-${label})`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: `drop-shadow(0 0 6px ${activeColor}40)`,
                        }}
                    />
                    <defs>
                        <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={activeColor}/>
                            <stop offset="100%" stopColor={secondColor}/>
                        </linearGradient>
                    </defs>
                </svg>
                {/* Center content */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 600,
                            fontSize: '1.25rem',
                            color: '#f1f5f9',
                            lineHeight: 1,
                        }}
                    >
                        {Math.round(value)}%
                    </Typography>
                </Box>
            </Box>
            <Stack alignItems="center" spacing={0.25}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{color: activeColor, display: 'flex', '& .MuiSvgIcon-root': {fontSize: '0.95rem'}}}>
                        {icon}
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#f1f5f9',
                        }}
                    >
                        {label}
                    </Typography>
                </Stack>
                <Typography
                    variant="caption"
                    sx={{
                        color: '#64748b',
                        fontSize: '0.7rem',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {detail}
                </Typography>
            </Stack>
        </Stack>
    );
};

const SystemResourcesMonitor = () => {
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [cpuUsage, setCpuUsage] = useState(0);
    const [memoryLeft, setMemoryLeft] = useState(0);
    const [memoryTotal, setMemoryTotal] = useState(0);
    const [storageLeft, setStorageLeft] = useState(0);
    const [storageTotal, setStorageTotal] = useState(0);
    const [cpuCount, setCpuCount] = useState(0);
    const [osName, setOsName] = useState("");

    useEffect(() => {
        fetchSystemResourceUsage();
    }, []);

    useInterval(() => fetchSystemResourceUsage(), 3000);

    const fetchSystemResourceUsage = async () => {
        const {data: systemInfo} = await getSystemInfo();
        setCpuUsage(Math.round(systemInfo.cpuUsage * 100));
        setMemoryLeft(systemInfo.memoryLeft);
        setMemoryTotal(systemInfo.memoryTotal);
        setStorageLeft(systemInfo.spaceLeft);
        setStorageTotal(systemInfo.spaceTotal);
        setCpuCount(systemInfo.cpuCount);
        setOsName(systemInfo.osName);
        setInfoLoaded(true);
    };

    const memoryUsedPercent = Math.round(((memoryTotal - memoryLeft) / memoryTotal) * 100);
    const storageUsedPercent = Math.round(((storageTotal - storageLeft) / storageTotal) * 100);

    if (!infoLoaded) {
        return (
            <Box
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                }}
            >
                <Stack direction="row" spacing={6} justifyContent="center" alignItems="center">
                    {[1, 2, 3].map((i) => (
                        <Stack key={i} alignItems="center" spacing={1}>
                            <Skeleton variant="circular" width={100} height={100}/>
                            <Skeleton variant="text" width={60}/>
                        </Stack>
                    ))}
                </Stack>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: {xs: 2.5, md: 4},
                borderRadius: '16px',
                background: 'rgba(17, 24, 39, 0.5)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                animation: 'fadeIn 0.5s ease',
            }}
        >
            <Stack
                direction={{xs: 'column', md: 'row'}}
                spacing={{xs: 3, md: 6}}
                justifyContent="center"
                alignItems="center"
            >
                {/* Gauges */}
                <Stack direction="row" spacing={{xs: 3, md: 5}} justifyContent="center" flexWrap="wrap">
                    <AnimatedGauge
                        value={cpuUsage}
                        label="CPU"
                        icon={<SpeedIcon/>}
                        detail={`${cpuCount} cores`}
                        color="#00e87b"
                        secondColor="#38bdf8"
                    />
                    <AnimatedGauge
                        value={memoryUsedPercent}
                        label="Memory"
                        icon={<MemoryIcon/>}
                        detail={`${humanFileSize(memoryTotal - memoryLeft)} / ${humanFileSize(memoryTotal)}`}
                        color="#38bdf8"
                        secondColor="#818cf8"
                    />
                    <AnimatedGauge
                        value={storageUsedPercent}
                        label="Storage"
                        icon={<StorageIcon/>}
                        detail={`${humanFileSize(storageTotal - storageLeft)} / ${humanFileSize(storageTotal)}`}
                        color="#818cf8"
                        secondColor="#c084fc"
                    />
                </Stack>

                {/* System Info */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.06)',
                        minWidth: 180,
                    }}
                >
                    <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <ComputerIcon sx={{fontSize: '1rem', color: '#64748b'}}/>
                            <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                System Info
                            </Typography>
                        </Stack>
                        <Stack spacing={0.75}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>OS</Typography>
                                <Typography variant="caption" sx={{
                                    color: '#f1f5f9',
                                    fontSize: '0.75rem',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    maxWidth: 140,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {osName}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>CPUs</Typography>
                                <Typography variant="caption" sx={{color: '#f1f5f9', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace"}}>
                                    {cpuCount}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>Free RAM</Typography>
                                <Typography variant="caption" sx={{color: '#f1f5f9', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace"}}>
                                    {humanFileSize(memoryLeft)}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>Free Disk</Typography>
                                <Typography variant="caption" sx={{color: '#f1f5f9', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace"}}>
                                    {humanFileSize(storageLeft)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default SystemResourcesMonitor;