import {Box, Stack, Tab, Tabs, Typography} from "@mui/material";
import ModsManagement from "../components/mods/ModsManagement.tsx";
import PresetsManagement from "../components/mods/PresetsManagement.tsx";
import ModsOverview from "../components/mods/ModsOverview.tsx";
import ModsCollections from "../components/mods/ModsCollections.tsx";
import ModPackTemplates from "../components/mods/ModPackTemplates.tsx";
import BohemiaBrowser from "../components/mods/BohemiaBrowser.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {SyntheticEvent} from "react";
import ExtensionIcon from '@mui/icons-material/Extension';

const ModsPage = () => {
    const {section} = useParams();
    const navigate = useNavigate();

    const handleTabSelect = (_: SyntheticEvent, newValue: string) => {
        navigate("/mods/" + newValue);
    }

    const currentTab = section ?? "OVERVIEW";

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
                        Workshop
                    </Typography>
                    <ExtensionIcon sx={{color: '#64748b'}}/>
                </Stack>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Browse the Bohemia Workshop, manage mods, presets, templates, and collections for your servers
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
                <Tabs
                    value={currentTab}
                    onChange={handleTabSelect}
                    sx={{
                        px: 2,
                        pt: 1,
                        '& .MuiTab-root': {
                            minHeight: 48,
                        },
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab value="OVERVIEW" label="Overview"/>
                    <Tab value="BROWSE" label="Browse Workshop"/>
                    <Tab value="MODS" label="Mod Management"/>
                    <Tab value="TEMPLATES" label="Mod Packs"/>
                    <Tab value="PRESETS" label="Presets"/>
                    <Tab value="COLLECTIONS" label="Collections"/>
                </Tabs>
                <Box sx={{p: {xs: 2, md: 3}}}>
                    {currentTab === "OVERVIEW" && <ModsOverview/>}
                    {currentTab === "BROWSE" && <BohemiaBrowser/>}
                    {currentTab === "MODS" && <ModsManagement/>}
                    {currentTab === "TEMPLATES" && <ModPackTemplates/>}
                    {currentTab === "PRESETS" && <PresetsManagement/>}
                    {currentTab === "COLLECTIONS" && <ModsCollections/>}
                </Box>
            </Box>
        </Box>
    )
}

export default ModsPage;