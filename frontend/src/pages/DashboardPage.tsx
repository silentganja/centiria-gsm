import {Box, Stack, Typography, Button, Chip} from "@mui/material";
import SystemResourcesMonitor from "../components/dashboard/SystemResourcesMonitor";
import ServerInstallations from "../components/dashboard/ServerInstallations";
import RefreshIcon from '@mui/icons-material/Refresh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const DashboardPage = () => {
    return (
        <Box className="page-content">
            {/* Header Section */}
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                justifyContent="space-between"
                alignItems={{xs: 'flex-start', sm: 'center'}}
                spacing={2}
                mb={4}
            >
                <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {getGreeting()}
                        </Typography>
                        <RocketLaunchIcon sx={{color: '#00e87b', fontSize: '1.5rem'}}/>
                    </Stack>
                    <Typography variant="body2" sx={{color: '#64748b'}}>
                        Welcome to Centiria GSM - Your Arma Reforger command center
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <Chip
                        label={new Date().toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                        size="small"
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(148, 163, 184, 0.08)',
                            color: '#94a3b8',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                        }}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RefreshIcon sx={{fontSize: '1rem'}}/>}
                        onClick={() => window.location.reload()}
                        sx={{
                            borderColor: 'rgba(148, 163, 184, 0.15)',
                            color: '#94a3b8',
                            fontSize: '0.8rem',
                            '&:hover': {
                                borderColor: '#00e87b',
                                color: '#00e87b',
                            },
                        }}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {/* System Monitor */}
            <Box mb={4}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        mb: 1.5,
                    }}
                >
                    System Resources
                </Typography>
                <SystemResourcesMonitor/>
            </Box>

            {/* Server Installations */}
            <Box>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        mb: 1.5,
                    }}
                >
                    Game Server Installations
                </Typography>
                <ServerInstallations/>
            </Box>
        </Box>
    );
};

export default DashboardPage;