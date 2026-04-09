import {useEffect, useState} from "react";
import {Box, Chip, Grid, LinearProgress, Stack, Typography, Button} from "@mui/material";
import {getMods} from "../../services/modsService";
import {getModPresets} from "../../services/modPresetsService";
import {ModDto} from "../../dtos/ModDto.ts";
import {ModPresetDto} from "../../dtos/ModPresetDto.ts";
import {humanFileSize} from "../../util/util.ts";
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorageIcon from '@mui/icons-material/Storage';
import ExtensionIcon from '@mui/icons-material/Extension';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SyncIcon from '@mui/icons-material/Sync';
import {useNavigate} from "react-router-dom";

const StatCard = ({icon, label, value, accent, sub}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: string;
    sub?: string;
}) => (
    <Box
        sx={{
            p: 2.5,
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.06)',
            transition: 'all 250ms ease',
            '&:hover': {
                borderColor: `${accent}30`,
                transform: 'translateY(-1px)',
            },
        }}
    >
        <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{color: accent, display: 'flex', '& .MuiSvgIcon-root': {fontSize: '1.1rem'}}}>
                    {icon}
                </Box>
                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    {label}
                </Typography>
            </Stack>
            <Typography sx={{fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '1.5rem', color: '#f1f5f9', lineHeight: 1}}>
                {value}
            </Typography>
            {sub && (
                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem'}}>
                    {sub}
                </Typography>
            )}
        </Stack>
    </Box>
);

export default function ModsOverview() {
    const [mods, setMods] = useState<Array<ModDto>>([]);
    const [presets, setPresets] = useState<Array<ModPresetDto>>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [{data: modsDto}, {data: presetsDto}] = await Promise.all([
                getMods(),
                getModPresets(),
            ]);
            setMods(modsDto.workshopMods);
            setPresets(presetsDto.presets);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const totalSize = mods.reduce((sum, mod) => sum + (mod.fileSize || 0), 0);
    const installedCount = mods.filter(m => m.installationStatus === "FINISHED").length;
    const errorCount = mods.filter(m => m.installationStatus === "ERROR").length;
    const installingCount = mods.filter(m => m.installationStatus === "INSTALLATION_IN_PROGRESS").length;

    const recentMods = [...mods]
        .filter(m => m.lastUpdated)
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 5);

    const largestMods = [...mods]
        .sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0))
        .slice(0, 5);

    if (loading) {
        return (
            <Box sx={{py: 4}}>
                <LinearProgress sx={{borderRadius: '4px'}}/>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Stats Cards */}
            <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<ExtensionIcon/>} label="Total Mods" value={mods.length} accent="#00e87b"/>
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<DownloadDoneIcon/>} label="Installed" value={installedCount} accent="#38bdf8" sub={errorCount > 0 ? `${errorCount} with errors` : undefined}/>
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<StorageIcon/>} label="Total Size" value={humanFileSize(totalSize)} accent="#818cf8"/>
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard icon={<PlaylistAddCheckIcon/>} label="Presets" value={presets.length} accent="#f59e0b"/>
                </Grid>
            </Grid>

            {/* Installing banner */}
            {installingCount > 0 && (
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '10px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <SyncIcon sx={{color: '#f59e0b', animation: 'spin 2s linear infinite', fontSize: '1.2rem'}}/>
                        <Typography variant="body2" sx={{color: '#f59e0b', fontWeight: 500}}>
                            {installingCount} mod{installingCount > 1 ? 's' : ''} currently installing...
                        </Typography>
                    </Stack>
                    <LinearProgress sx={{mt: 1.5, height: 4, borderRadius: '2px'}}/>
                </Box>
            )}

            {/* Error banner */}
            {errorCount > 0 && (
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        cursor: 'pointer',
                        '&:hover': {borderColor: 'rgba(239, 68, 68, 0.4)'},
                    }}
                    onClick={() => navigate('/mods/MODS')}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <ErrorOutlineIcon sx={{color: '#ef4444', fontSize: '1.2rem'}}/>
                        <Typography variant="body2" sx={{color: '#ef4444', fontWeight: 500}}>
                            {errorCount} mod{errorCount > 1 ? 's' : ''} failed to install. Click to view details.
                        </Typography>
                    </Stack>
                </Box>
            )}

            {/* Two column layout */}
            <Grid container spacing={2}>
                {/* Recently Updated */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: '12px',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.06)',
                            height: '100%',
                        }}
                    >
                        <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block'}}>
                            Recently Updated
                        </Typography>
                        {recentMods.length === 0 ? (
                            <Typography variant="body2" sx={{color: '#475569', fontStyle: 'italic'}}>
                                No mods installed yet
                            </Typography>
                        ) : (
                            <Stack spacing={1}>
                                {recentMods.map(mod => (
                                    <Stack key={mod.id} direction="row" justifyContent="space-between" alignItems="center"
                                        sx={{
                                            p: 1,
                                            borderRadius: '8px',
                                            '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.04)'},
                                        }}
                                    >
                                        <Stack>
                                            <Typography variant="body2" sx={{fontSize: '0.85rem', fontWeight: 500, color: '#f1f5f9'}}>
                                                {mod.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem'}}>
                                                ID: {mod.id}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', whiteSpace: 'nowrap'}}>
                                            {mod.lastUpdated ? new Date(mod.lastUpdated).toLocaleDateString() : '-'}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Grid>

                {/* Largest Mods */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: '12px',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.06)',
                            height: '100%',
                        }}
                    >
                        <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block'}}>
                            Largest Mods (by size)
                        </Typography>
                        {largestMods.length === 0 ? (
                            <Typography variant="body2" sx={{color: '#475569', fontStyle: 'italic'}}>
                                No mods installed yet
                            </Typography>
                        ) : (
                            <Stack spacing={1}>
                                {largestMods.map(mod => (
                                    <Stack key={mod.id} direction="row" justifyContent="space-between" alignItems="center"
                                        sx={{
                                            p: 1,
                                            borderRadius: '8px',
                                            '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.04)'},
                                        }}
                                    >
                                        <Typography variant="body2" sx={{fontSize: '0.85rem', fontWeight: 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%'}}>
                                            {mod.name}
                                        </Typography>
                                        <Chip
                                            label={humanFileSize(mod.fileSize)}
                                            size="small"
                                            sx={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '0.7rem',
                                                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                                                color: '#818cf8',
                                                border: '1px solid rgba(129, 140, 248, 0.2)',
                                            }}
                                        />
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/mods/MODS')}
                    sx={{
                        borderColor: 'rgba(148, 163, 184, 0.15)',
                        color: '#94a3b8',
                        '&:hover': {borderColor: '#00e87b', color: '#00e87b'},
                    }}
                >
                    Manage Mods
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/mods/PRESETS')}
                    sx={{
                        borderColor: 'rgba(148, 163, 184, 0.15)',
                        color: '#94a3b8',
                        '&:hover': {borderColor: '#38bdf8', color: '#38bdf8'},
                    }}
                >
                    View Presets
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/mods/COLLECTIONS')}
                    sx={{
                        borderColor: 'rgba(148, 163, 184, 0.15)',
                        color: '#94a3b8',
                        '&:hover': {borderColor: '#818cf8', color: '#818cf8'},
                    }}
                >
                    Browse Collections
                </Button>
            </Stack>
        </Stack>
    );
}
