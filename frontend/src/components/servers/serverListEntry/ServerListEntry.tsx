import {Link} from "react-router-dom";
import {Box, Chip, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import {ServerDto} from "../../../dtos/ServerDto.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {useState} from "react";
import {ServerListEntryDetails} from "./ServerListEntryDetails.tsx";
import {SeverControls} from "./SeverControls.tsx";

import PeopleIcon from '@mui/icons-material/People';

import {toast} from "material-react-toastify";

type ServerListEntryProps = {
    server: ServerDto,
    status: ServerInstanceInfoDto | null,
    serverWithSamePortRunning: boolean,
    onStartServer: (id: number) => void,
    onStopServer: (id: number) => void,
    onRestartServer: (id: number) => void,
    onDeleteServer: (id: number) => void,
    onOpenLogs: (id: number) => void
}

const ServerListEntry = (props: ServerListEntryProps) => {
    const {
        server,
        status,
        onStartServer,
        onStopServer,
        onRestartServer,
        onDeleteServer,
        serverWithSamePortRunning
    } = props;

    const [isExpanded, setExpanded] = useState(false);

    if (server.id === undefined) {
        console.error("Server should have ID assigned.");
        return;
    }

    const serverRunning = status && status.alive;

    const handleExpandClick = () => {
        setExpanded(prevState => !prevState);
    };

    const copyPort = () => {
        navigator.clipboard.writeText(String(server.port));
        toast.success("Port copied to clipboard");
    };

    return (
        <Box
            id={`server-${server.id}-list-entry`}
            sx={{
                borderRadius: '14px',
                background: 'rgba(17, 24, 39, 0.5)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${serverRunning ? 'rgba(0, 232, 123, 0.15)' : 'rgba(148, 163, 184, 0.08)'}`,
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                animation: 'fadeIn 0.4s ease both',
                '&:hover': {
                    borderColor: serverRunning ? 'rgba(0, 232, 123, 0.25)' : 'rgba(148, 163, 184, 0.15)',
                    boxShadow: serverRunning
                        ? '0 4px 24px rgba(0, 232, 123, 0.1)'
                        : '0 4px 24px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            {/* Main Row */}
            <Stack
                direction={{xs: 'column', md: 'row'}}
                alignItems={{xs: 'stretch', md: 'center'}}
                spacing={2}
                sx={{p: {xs: 2, md: 2.5}}}
            >
                {/* Status + Name */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{flex: 1, minWidth: 0}}>
                    {/* Status Indicator */}
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: serverRunning ? '#00e87b' : '#475569',
                            boxShadow: serverRunning ? '0 0 12px rgba(0, 232, 123, 0.4)' : 'none',
                            animation: serverRunning ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                            flexShrink: 0,
                        }}
                    />
                    <Stack sx={{minWidth: 0}}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                fontSize: '1rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {server.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                                variant="caption"
                                sx={{color: '#64748b', fontSize: '0.75rem'}}
                            >
                                Arma Reforger
                            </Typography>
                            <Tooltip title="Click to copy" arrow>
                                <Chip
                                    label={`Port ${server.port}`}
                                    size="small"
                                    onClick={copyPort}
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        backgroundColor: 'rgba(148, 163, 184, 0.08)',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 232, 123, 0.1)',
                                            color: '#00e87b',
                                        },
                                    }}
                                />
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Player Count (when running) */}
                {serverRunning && status && (
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{minWidth: 80}}>
                        <PeopleIcon sx={{fontSize: '1rem', color: '#64748b'}}/>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.85rem',
                                color: '#f1f5f9',
                            }}
                        >
                            {status.playersOnline}/{status.maxPlayers}
                        </Typography>
                    </Stack>
                )}

                {/* Controls */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <SeverControls
                        serverRunning={status && status.alive}
                        server={server}
                        onStartServer={() => onStartServer(server.id as number)}
                        onStopServer={() => onStopServer(server.id as number)}
                        onRestartServer={() => onRestartServer(server.id as number)}
                        disabled={serverWithSamePortRunning}
                    />
                    <Tooltip title="Settings" arrow>
                        <IconButton
                            component={Link}
                            to={"/servers/" + server.id}
                            size="small"
                            sx={{
                                color: '#64748b',
                                border: '1px solid rgba(148, 163, 184, 0.12)',
                                borderRadius: '8px',
                                '&:hover': {
                                    color: '#f1f5f9',
                                    borderColor: 'rgba(148, 163, 184, 0.25)',
                                    backgroundColor: 'rgba(148, 163, 184, 0.06)',
                                },
                            }}
                        >
                            <SettingsIcon sx={{fontSize: '1.1rem'}}/>
                        </IconButton>
                    </Tooltip>
                    {!serverRunning && (
                        <Tooltip title="Delete" arrow>
                            <IconButton
                                size="small"
                                onClick={() => onDeleteServer(server.id as number)}
                                sx={{
                                    color: '#64748b',
                                    border: '1px solid rgba(148, 163, 184, 0.12)',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        color: '#ef4444',
                                        borderColor: 'rgba(239, 68, 68, 0.3)',
                                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    },
                                }}
                            >
                                <DeleteIcon sx={{fontSize: '1.1rem'}}/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton
                        onClick={handleExpandClick}
                        size="small"
                        sx={{
                            color: '#64748b',
                            transition: 'transform 200ms ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    >
                        <ExpandMoreIcon sx={{fontSize: '1.2rem'}}/>
                    </IconButton>
                </Stack>
            </Stack>

            {/* Expanded Details */}
            {isExpanded && (
                <Box
                    sx={{
                        px: {xs: 2, md: 2.5},
                        pb: 2.5,
                        pt: 0,
                        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
                        animation: 'fadeIn 0.25s ease',
                    }}
                >
                    <Box sx={{pt: 2}}>
                        <ServerListEntryDetails
                            server={server}
                            serverStatus={status}
                            onClick={() => props.onOpenLogs(server.id as number)}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ServerListEntry;
