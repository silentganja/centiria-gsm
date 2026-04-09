import {Box, Stack, Typography} from "@mui/material";
import SteamAuthForm from "../components/appConfig/SteamAuthForm";
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
                        Settings
                    </Typography>
                    <SettingsIcon sx={{color: '#64748b'}}/>
                </Stack>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Configure Steam authentication and app settings
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
                <SteamAuthForm/>
            </Box>
        </Box>
    );
};

export default AppConfigPage;