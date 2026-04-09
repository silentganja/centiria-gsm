import {useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    Alert,
    Chip,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {getBohemiaModDetails, registerReforgerMod} from "../../services/modsService";
import {toast} from "material-react-toastify";

interface BohemiaModInfo {
    modId: string;
    name: string;
    author: string;
    description: string;
    thumbnailUrl: string;
}

const BohemiaBrowser = () => {
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [modInfo, setModInfo] = useState<BohemiaModInfo | null>(null);
    const [registering, setRegistering] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState("");

    const handleLookup = async () => {
        const hexId = searchInput.trim().toUpperCase();
        if (!hexId || !/^[0-9A-F]{12,16}$/i.test(hexId)) {
            setError("Please enter a valid Bohemia hex GUID (e.g. 595F2BF2F44836FB)");
            return;
        }
        setError("");
        setModInfo(null);
        setRegistered(false);
        setLoading(true);

        try {
            const {data} = await getBohemiaModDetails(hexId);
            setModInfo(data);
        } catch {
            setError("Mod not found or Bohemia Workshop is unreachable. Double-check the hex GUID.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!modInfo) return;
        setRegistering(true);
        try {
            await registerReforgerMod(modInfo.modId, modInfo.name);
            toast.success(`Mod "${modInfo.name}" registered successfully! It will download on next server start.`);
            setRegistered(true);
        } catch {
            toast.error("Failed to register mod. Check backend logs.");
        } finally {
            setRegistering(false);
        }
    };

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Box>
                <Typography variant="h6" sx={{fontWeight: 700, color: '#f1f5f9', mb: 0.5}}>
                    Bohemia Workshop Browser
                </Typography>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Look up any Arma Reforger mod by its Bohemia hex GUID and register it for your server.
                    Mods are downloaded natively by the server executable on startup.
                </Typography>
            </Box>

            {/* Info Banner */}
            <Alert
                severity="info"
                sx={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    color: '#bae6fd',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    '& .MuiAlert-icon': {color: '#38bdf8'},
                }}
            >
                <strong>How to find a Mod ID:</strong> Visit{' '}
                <a
                    href="https://reforger.armaplatform.com/workshop"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: '#38bdf8'}}
                >
                    reforger.armaplatform.com/workshop
                </a>
                , click on a mod, and copy the hex GUID from the URL. Example: <code style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem',
                }}>595F2BF2F44836FB</code>
            </Alert>

            {/* Search */}
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <TextField
                    fullWidth
                    placeholder="Enter Bohemia Mod GUID (e.g. 595F2BF2F44836FB)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    error={!!error}
                    helperText={error}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{color: '#64748b'}}/>
                            </InputAdornment>
                        ),
                        sx: {
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.9rem',
                            background: 'rgba(15, 23, 42, 0.5)',
                            borderRadius: '10px',
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {borderColor: 'rgba(148, 163, 184, 0.1)'},
                            '&:hover fieldset': {borderColor: 'rgba(0, 232, 123, 0.3)'},
                            '&.Mui-focused fieldset': {borderColor: '#00e87b'},
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleLookup}
                    disabled={loading || !searchInput.trim()}
                    sx={{
                        minWidth: 120,
                        height: 56,
                        background: 'linear-gradient(135deg, #00e87b 0%, #00b35f 100%)',
                        color: '#06090f',
                        fontWeight: 700,
                        borderRadius: '10px',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                        },
                        '&:disabled': {
                            background: 'rgba(148, 163, 184, 0.1)',
                            color: '#64748b',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{color: '#06090f'}}/> : 'Look Up'}
                </Button>
            </Stack>

            {/* Result Card */}
            {modInfo && (
                <Box
                    sx={{
                        p: 3,
                        borderRadius: '14px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: registered ? '1px solid rgba(0, 232, 123, 0.3)' : '1px solid rgba(148, 163, 184, 0.1)',
                        transition: 'all 300ms ease',
                    }}
                >
                    <Stack direction={{xs: 'column', md: 'row'}} spacing={3}>
                        {/* Thumbnail */}
                        {modInfo.thumbnailUrl && (
                            <Box
                                sx={{
                                    width: {xs: '100%', md: 200},
                                    height: {xs: 160, md: 130},
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: 'rgba(0,0,0,0.3)',
                                }}
                            >
                                <img
                                    src={modInfo.thumbnailUrl}
                                    alt={modInfo.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </Box>
                        )}

                        {/* Info */}
                        <Stack spacing={1} flex={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography sx={{fontWeight: 700, fontSize: '1.2rem', color: '#f1f5f9'}}>
                                    {modInfo.name}
                                </Typography>
                                {registered && (
                                    <Chip
                                        icon={<CheckCircleIcon/>}
                                        label="Registered"
                                        size="small"
                                        sx={{
                                            background: 'rgba(0, 232, 123, 0.15)',
                                            color: '#00e87b',
                                            '& .MuiChip-icon': {color: '#00e87b'},
                                        }}
                                    />
                                )}
                            </Stack>

                            <Typography variant="body2" sx={{color: '#94a3b8'}}>
                                by <span style={{color: '#38bdf8'}}>{modInfo.author}</span>
                            </Typography>

                            {modInfo.description && (
                                <Typography variant="body2" sx={{
                                    color: '#64748b',
                                    maxHeight: 60,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {modInfo.description.substring(0, 200)}{modInfo.description.length > 200 ? '...' : ''}
                                </Typography>
                            )}

                            <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 1}}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: '#94a3b8',
                                        background: 'rgba(0,0,0,0.3)',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: '6px',
                                    }}
                                >
                                    {modInfo.modId}
                                </Typography>

                                <Tooltip title="View on Bohemia Workshop">
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(
                                            `https://reforger.armaplatform.com/workshop/${modInfo.modId}`,
                                            '_blank'
                                        )}
                                        sx={{color: '#64748b', '&:hover': {color: '#38bdf8'}}}
                                    >
                                        <OpenInNewIcon sx={{fontSize: '1rem'}}/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        {/* Action */}
                        <Stack justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={registered ? <CheckCircleIcon/> : <AddCircleIcon/>}
                                onClick={handleRegister}
                                disabled={registering || registered}
                                sx={{
                                    minWidth: 160,
                                    height: 48,
                                    background: registered
                                        ? 'rgba(0, 232, 123, 0.15)'
                                        : 'linear-gradient(135deg, #00e87b 0%, #00b35f 100%)',
                                    color: registered ? '#00e87b' : '#06090f',
                                    fontWeight: 700,
                                    borderRadius: '10px',
                                    border: registered ? '1px solid rgba(0, 232, 123, 0.3)' : 'none',
                                    '&:hover': {
                                        background: registered
                                            ? 'rgba(0, 232, 123, 0.2)'
                                            : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                                    },
                                    '&:disabled': {
                                        background: registered ? 'rgba(0, 232, 123, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                                        color: registered ? '#00e87b' : '#64748b',
                                    },
                                }}
                            >
                                {registering ? (
                                    <CircularProgress size={20} sx={{color: '#06090f'}}/>
                                ) : registered ? (
                                    'Registered'
                                ) : (
                                    'Add to Server'
                                )}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
};

export default BohemiaBrowser;
