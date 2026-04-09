import {useEffect, useRef, useState} from "react";
import {Box, Modal, Typography, Stack, IconButton} from "@mui/material";
import {downloadLogFile, getServerLogs} from "../../../services/serverLogService.ts";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

type ServerLogsProps = {
    serverId: number,
    onClose: () => void
}

const ServerLogs = ({serverId, onClose}: ServerLogsProps) => {
    const [logs, setLogs] = useState("");
    const logContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        void fetchLogs();
    }, []);

    async function fetchLogs() {
        const {data: downloadedLogs} = await getServerLogs(serverId);
        setLogs(downloadedLogs);
        if (logContainer.current) {
            logContainer.current.scrollTop = logContainer.current.scrollHeight;
        }
    }

    async function handleDownloadLogFile() {
        downloadLogFile(serverId);
    }

    function isLogEmpty() {
        return !logs || logs.length === 0;
    }

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {xs: '95vw', md: 900},
                    maxHeight: '85vh',
                    bgcolor: '#111827',
                    borderRadius: '16px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                    overflow: 'hidden',
                    animation: 'fadeInScale 0.3s ease',
                }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: 600, fontSize: '1rem'}}>
                        Server Logs
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton
                            size="small"
                            onClick={fetchLogs}
                            sx={{
                                color: '#64748b',
                                border: '1px solid rgba(148, 163, 184, 0.12)',
                                borderRadius: '8px',
                                '&:hover': {
                                    color: '#00e87b',
                                    borderColor: 'rgba(0, 232, 123, 0.3)',
                                },
                            }}
                        >
                            <RefreshIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleDownloadLogFile}
                            disabled={isLogEmpty()}
                            sx={{
                                color: '#64748b',
                                border: '1px solid rgba(148, 163, 184, 0.12)',
                                borderRadius: '8px',
                                '&:hover': {
                                    color: '#38bdf8',
                                    borderColor: 'rgba(56, 189, 248, 0.3)',
                                },
                            }}
                        >
                            <FileDownloadIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                color: '#64748b',
                                '&:hover': {color: '#f1f5f9'},
                            }}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Log Content */}
                <Box
                    ref={logContainer}
                    sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.78rem',
                        lineHeight: 1.7,
                        color: '#00e87b',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        p: 2.5,
                        m: 2,
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.06)',
                        maxHeight: '60vh',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                    }}
                >
                    {isLogEmpty() ? (
                        <Typography
                            sx={{
                                color: '#475569',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.8rem',
                                fontStyle: 'italic',
                            }}
                        >
                            No logs available for this server
                        </Typography>
                    ) : logs}
                </Box>
            </Box>
        </Modal>
    );
}

export default ServerLogs;