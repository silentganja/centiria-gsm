import {Box, Stack, Typography, Alert, AlertTitle} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

const AppConfigPage = () => {
    return (
        <Box className="page-content">
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
                        Global Settings
                    </Typography>
                    <SettingsIcon sx={{color: '#64748b'}}/>
                </Stack>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Centiria GSM System Configuration
                </Typography>
            </Stack>
            
            <Box
                sx={{
                    p: {xs: 2.5, md: 3},
                    borderRadius: '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                }}
            >
                <Alert 
                    severity="info" 
                    sx={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: '#bae6fd',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        '& .MuiAlert-icon': {
                            color: '#38bdf8'
                        }
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 700, color: '#e0f2fe' }}>Steam Authentication Deprecated</AlertTitle>
                    Arma Reforger natively utilizes the Bohemia Interactive backend to manage and download workshop content autonomously.<br/><br/>
                    <strong>You no longer need to link a Steam Account, provide a Steam Guard token, or use a Steam Web API Key to operate public servers or download mods.</strong>
                </Alert>
            </Box>
        </Box>
    );
};

export default AppConfigPage;