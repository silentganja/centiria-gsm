import {useEffect, useRef, useState} from "react";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {downloadLogFile, getLogs} from "../../services/steamCmdService.ts";
import {Box, Stack, Typography} from "@mui/material";

export const SteamCmdLogsTool = () => {
    const [logs, setLogs] = useState("");
    const logTextArea = useRef<HTMLDivElement>(null);

    useEffect(() => {
        void fetchLogs();
    }, []);

    async function fetchLogs() {
        const {data: downloadedLogs} = await getLogs();
        setLogs(downloadedLogs);
        if (logTextArea.current) {
            logTextArea.current.scrollTop = logTextArea.current.scrollHeight;
        }
    }

    async function handleDownloadLogFile() {
        downloadLogFile();
    }

    function isLogEmpty() {
        return !logs || logs.length === 0;
    }

    return (
        <Box>
            {/* Terminal Output */}
            <Box
                ref={logTextArea}
                sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                    color: '#00e87b',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    p: 2.5,
                    borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.06)',
                    maxHeight: '500px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    mb: 1.5,
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
                        No logs available...
                    </Typography>
                ) : logs}
            </Box>

            {/* Controls */}
            <Stack direction="row" spacing={0.5}>
                <IconButton
                    color="primary"
                    aria-label="refresh logs"
                    onClick={fetchLogs}
                    size="small"
                    sx={{
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '8px',
                        '&:hover': {
                            borderColor: 'rgba(0, 232, 123, 0.3)',
                            backgroundColor: 'rgba(0, 232, 123, 0.06)',
                        },
                    }}
                >
                    <RefreshIcon fontSize="small"/>
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="download log file"
                    onClick={handleDownloadLogFile}
                    disabled={isLogEmpty()}
                    size="small"
                    sx={{
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '8px',
                        '&:hover': {
                            borderColor: 'rgba(0, 232, 123, 0.3)',
                            backgroundColor: 'rgba(0, 232, 123, 0.06)',
                        },
                    }}
                >
                    <FileDownloadIcon fontSize="small"/>
                </IconButton>
            </Stack>
        </Box>
    );
};
