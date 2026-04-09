import {Box, Stack, Tab, Tabs, Typography} from "@mui/material";
import {SyntheticEvent, useState} from "react";
import {SteamCmdLogsTool} from "../components/tools/SteamCmdLogsTool.tsx";
import BuildIcon from '@mui/icons-material/Build';

enum Tool {
    STEAMCMD_LOGS = "SteamCMD Logs"
}

const ToolsPage = () => {
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.STEAMCMD_LOGS);

    const handleChange = (_: SyntheticEvent, newTool: Tool) => {
        setSelectedTool(newTool);
    };

    const renderSelectedTool = () => {
        switch (selectedTool) {
            case Tool.STEAMCMD_LOGS:
                return <SteamCmdLogsTool/>;
        }
    }

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
                        Tools
                    </Typography>
                    <BuildIcon sx={{color: '#64748b'}}/>
                </Stack>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    System tools and diagnostics
                </Typography>
            </Stack>
            <Box
                sx={{
                    borderRadius: '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    overflow: 'hidden',
                }}
            >
                <Tabs value={selectedTool} onChange={handleChange} sx={{px: 2, pt: 1}}>
                    <Tab value={Tool.STEAMCMD_LOGS} label={Tool.STEAMCMD_LOGS}/>
                </Tabs>
                <Box sx={{p: {xs: 2, md: 3}}}>
                    {renderSelectedTool()}
                </Box>
            </Box>
        </Box>
    );
}

export default ToolsPage;