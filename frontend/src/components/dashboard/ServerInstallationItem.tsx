import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Chip,
    LinearProgress,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import reforgerLogo from "../../img/reforger_logo.jpg";
import SERVER_NAMES from "../../util/serverNames";
import config from "../../config";
import workshopErrorStatusMap from "../../util/workshopErrorStatusMap";
import {ServerInstallationDto} from "../../dtos/ServerInstallationDto.ts";
import {ErrorStatus} from "../../dtos/Status.ts";
import {ServerType} from "../../dtos/ServerDto.ts";
import {ServerBranchSelect} from "./ServerBranchSelect.tsx";
import {SteamCmdItemInfoDto, SteamCmdStatus} from "../../dtos/SteamCmdItemInfoDto.ts";
import {humanFileSize} from "../../util/util.ts";
import DownloadIcon from '@mui/icons-material/Download';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const isInstalling = (installation: ServerInstallationDto) => {
    return installation.installationStatus === "INSTALLATION_IN_PROGRESS";
}

type ServerInstallationItemProps = {
    installation: ServerInstallationDto,
    onUpdateClicked: (serverType: ServerType) => void,
    onBranchChanged: (e: SelectChangeEvent, serverType: ServerType) => Promise<void>,
    steamCmdItemInfo: SteamCmdItemInfoDto | undefined
}

const ServerInstallationItem = (props: ServerInstallationItemProps) => {
    const {installation, steamCmdItemInfo, onUpdateClicked, onBranchChanged} = props;

    const hasMultipleAvailableBranches = () => installation.availableBranches.length > 1;

    const getProgressBar = () => {
        if (steamCmdItemInfo && steamCmdItemInfo.bytesTotal) {
            const progressPercent = (steamCmdItemInfo.bytesFinished / steamCmdItemInfo.bytesTotal) * 100;
            return (
                <Stack spacing={0.5}>
                    <LinearProgress variant="determinate" value={progressPercent} sx={{height: 8, borderRadius: '4px'}}/>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem'}}>
                            {humanFileSize(steamCmdItemInfo.bytesFinished)}
                        </Typography>
                        <Typography variant="caption" sx={{color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem'}}>
                            {humanFileSize(steamCmdItemInfo.bytesTotal)}
                        </Typography>
                    </Stack>
                </Stack>
            );
        }
        return <LinearProgress sx={{height: 8, borderRadius: '4px'}}/>;
    };

    const getActionButton = () => {
        if (isInstalling(installation) && steamCmdItemInfo === undefined) {
            return (
                <Button fullWidth variant="contained" disabled sx={{py: 1.2}}>
                    {installation.lastUpdatedAt === null ? "Installing..." : "Updating..."}
                </Button>
            );
        }

        if (isInstalling(installation) && steamCmdItemInfo !== undefined) {
            let displayText = "";
            if (steamCmdItemInfo.status === SteamCmdStatus.FINISHED) {
                displayText = "Finalizing";
            } else if (steamCmdItemInfo.status === SteamCmdStatus.IN_QUEUE) {
                displayText = "In Queue";
            } else {
                displayText = steamCmdItemInfo.status;
            }

            return (
                <Button fullWidth variant="contained" disabled sx={{py: 1.2}}>
                    {displayText}
                </Button>
            );
        }

        return (
            <Button
                fullWidth
                variant="contained"
                onClick={() => onUpdateClicked(ServerType[installation.type])}
                color={installation.errorStatus === null ? "primary" : "error"}
                startIcon={installation.errorStatus !== null ? <ErrorIcon/> : (installation.lastUpdatedAt === null ? <DownloadIcon/> : <UpdateIcon/>)}
                sx={{py: 1.2}}
            >
                {installation.errorStatus !== null && "Retry "}
                {installation.lastUpdatedAt === null ? "Install" : "Update"}
            </Button>
        );
    };

    return (
        <Box
            sx={{
                borderRadius: '16px',
                background: 'rgba(17, 24, 39, 0.5)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                overflow: 'hidden',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'fadeIn 0.5s ease',
                '&:hover': {
                    borderColor: 'rgba(0, 232, 123, 0.15)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Banner */}
            <Box
                sx={{
                    height: 120,
                    backgroundImage: `url(${reforgerLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 30%, rgba(17, 24, 39, 0.95) 100%)',
                    },
                }}
            />

            {/* Content */}
            <Box sx={{p: 2.5, mt: -3, position: 'relative', zIndex: 1}}>
                {installation.errorStatus && (
                    <Alert severity="error" sx={{mb: 2, borderRadius: '10px'}}>
                        <AlertTitle sx={{fontWeight: 600}}>Error</AlertTitle>
                        {workshopErrorStatusMap.get(ErrorStatus[installation.errorStatus as keyof typeof ErrorStatus])
                            ?? "Unknown error"}
                    </Alert>
                )}

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                        }}
                    >
                        {SERVER_NAMES.get(installation.type)}
                    </Typography>
                    {installation.lastUpdatedAt && (
                        <Chip
                            icon={<CheckCircleIcon sx={{fontSize: '0.85rem !important'}}/>}
                            label="Installed"
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(0, 232, 123, 0.1)',
                                color: '#00e87b',
                                border: '1px solid rgba(0, 232, 123, 0.2)',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                            }}
                        />
                    )}
                </Stack>

                {hasMultipleAvailableBranches() && (
                    <Box mb={1.5}>
                        <ServerBranchSelect installation={installation}
                                            onChange={(e) => onBranchChanged(e, installation.type)}/>
                    </Box>
                )}

                {!isInstalling(installation) ? (
                    <Stack spacing={0.5} mb={2}>
                        {installation.version && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>Version</Typography>
                                <Typography variant="caption" sx={{
                                    color: '#f1f5f9',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '0.75rem',
                                }}>
                                    {installation.version}
                                </Typography>
                            </Stack>
                        )}
                        {installation.lastUpdatedAt && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>Last updated</Typography>
                                <Typography variant="caption" sx={{
                                    color: '#f1f5f9',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '0.75rem',
                                }}>
                                    {new Date(installation.lastUpdatedAt).toLocaleString(undefined, config.dateFormat)}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                ) : (
                    <Box mb={2}>
                        {getProgressBar()}
                    </Box>
                )}

                {getActionButton()}
            </Box>
        </Box>
    );
};

export default ServerInstallationItem;