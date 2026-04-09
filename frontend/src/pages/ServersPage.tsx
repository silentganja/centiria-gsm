import {
    createServer,
    deleteServer,
    getServers,
    getServerStatus,
    restartServer,
    startServer,
    stopServer
} from "../services/serversService"
import {useEffect, useState} from "react";
import {useInterval} from "../hooks/use-interval";
import ServerListEntry from "../components/servers/serverListEntry/ServerListEntry.tsx";
import {Box, Button, Chip, Stack, Typography} from "@mui/material";
import {toast} from "material-react-toastify";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import ServerLogs from "../components/servers/serverListEntry/ServerLogs.tsx";
import {ServerDto} from "../dtos/ServerDto";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {Link} from "react-router-dom";
import DnsIcon from '@mui/icons-material/Dns';

type ServerInstance = {
    server: ServerDto,
    status: ServerInstanceInfoDto | null
}

const ServersPage = () => {
    const [serverInstances, setServerInstances] = useState<ServerInstance[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [serverToDelete, setServerToDelete] = useState<ServerDto | null>();
    const [logServerId, setLogServerId] = useState<number>();
    const [isLogOpen, setIsLogOpen] = useState(false);

    useEffect(() => {
        fetchServers()
    }, [])

    useInterval(async () => {
        await updateActiveServersStatus();
    }, 10000);

    const fetchServers = async () => {
        const {data: servers} = await getServers();
        const instances = servers.servers.map((server: ServerDto) => {
            return {server, status: null}
        });
        for (const instance of instances) {
            const {data: status} = await getServerStatus(instance.server.id);
            instance.status = status;
        }
        setServerInstances(instances);
    }

    function shouldUpdateServerStatus(instance: ServerInstance) {
        return instance.status === null || instance.status.alive;
    }

    const updateActiveServersStatus = async () => {
        serverInstances.filter(shouldUpdateServerStatus)
            .map(s => s.server)
            .forEach(updateServerStatus);
    }

    const updateServerStatus = async (server: ServerDto) => {
        if (server.id == null) return;
        const {data: instanceInfo} = await getServerStatus(server.id);
        const newInstances = [...serverInstances];
        const foundInstance = newInstances.find(instance => instance.server.id === server.id);
        if (!foundInstance) return;
        foundInstance.status = instanceInfo;
        setServerInstances(newInstances);
    }

    const isServerWithSamePortRunning = (server: ServerDto) => {
        const activeServerWithSamePort = serverInstances
            .filter(anotherInstance => anotherInstance.server !== server)
            .filter(anotherInstance => anotherInstance.status && anotherInstance.status.alive)
            .filter(anotherInstance => anotherInstance.server.port === server.port || anotherInstance.server.queryPort === server.queryPort);
        return !!activeServerWithSamePort[0];
    }

    const handleStartServer = async (id: number) => {
        updateServerList(id, true);
        await startServer(id);
    };

    const handleStopServer = async (id: number) => {
        updateServerList(id, false);
        await stopServer(id);
    };

    const handleRestartServer = async (id: number) => {
        updateServerList(id, false);
        await restartServer(id);
    };

    const updateServerList = (targetServerId: number, isNewServerAlive: boolean): void => {
        const newInstances = [...serverInstances];
        const instance = newInstances.find(instance => instance.server.id === targetServerId);
        if (!instance) return;

        instance.status = {
            description: "",
            map: "",
            maxPlayers: 0,
            playersOnline: 0,
            startedAt: "",
            version: "",
            headlessClientsCount: 0,
            ...instance.status,
            alive: isNewServerAlive
        };

        setServerInstances(newInstances);
    }

    const handleDeleteServerClicked = (server: ServerDto) => {
        setServerToDelete(server);
        setDeleteDialogOpen(true);
    }

    const handleDeleteServer = async () => {
        if (!serverToDelete || !serverToDelete.id) return;
        setServerInstances(prevState => [...prevState].filter(server => server.server.id !== serverToDelete.id));
        await deleteServer(serverToDelete.id);
        toast.success(`Server '${serverToDelete.name}' successfully deleted`);
        setServerToDelete(null);
        setDeleteDialogOpen(false);
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setServerToDelete(null);
    }

    const handleOpenLogs = (serverId: number) => {
        setIsLogOpen(true);
        setLogServerId(serverId);
    }

    const handleCloseLogs = () => {
        setIsLogOpen(false);
    }

    const handleDuplicateServer = async (server: ServerDto) => {
        const duplicatedServer = {...server, name: server.name + " (copy)"};
        const {data: createdServer} = await createServer(duplicatedServer);
        setServerInstances(prevState => [...prevState, {server: createdServer, status: null}]);
        toast.success(`Server '${server.name}' successfully duplicated`);
    };

    const onlineCount = serverInstances.filter(i => i.status && i.status.alive).length;

    return (
        <Box className="page-content">
            {/* Header */}
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                justifyContent="space-between"
                alignItems={{xs: 'flex-start', sm: 'center'}}
                spacing={2}
                mb={3}
            >
                <Stack spacing={0.5}>
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
                            Servers
                        </Typography>
                        <Chip
                            icon={<DnsIcon sx={{fontSize: '0.85rem !important'}}/>}
                            label={`${onlineCount} Online`}
                            size="small"
                            sx={{
                                backgroundColor: onlineCount > 0 ? 'rgba(0, 232, 123, 0.1)' : 'rgba(148, 163, 184, 0.08)',
                                color: onlineCount > 0 ? '#00e87b' : '#64748b',
                                border: `1px solid ${onlineCount > 0 ? 'rgba(0, 232, 123, 0.2)' : 'rgba(148, 163, 184, 0.1)'}`,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                            }}
                        />
                    </Stack>
                    <Typography variant="body2" sx={{color: '#64748b'}}>
                        Manage your Arma Reforger server instances
                    </Typography>
                </Stack>
                <Button
                    component={Link}
                    to="/servers/new/REFORGER"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon/>}
                    sx={{px: 3}}
                >
                    New Reforger Server
                </Button>
            </Stack>

            {/* Server Log Modal */}
            {isLogOpen && logServerId !== undefined && <ServerLogs onClose={handleCloseLogs} serverId={logServerId}/>}

            {/* Server list */}
            {serverInstances.length === 0 ? (
                <Box
                    sx={{
                        p: 6,
                        borderRadius: '16px',
                        background: 'rgba(17, 24, 39, 0.4)',
                        border: '1px solid rgba(148, 163, 184, 0.08)',
                        textAlign: 'center',
                    }}
                >
                    <DnsIcon sx={{fontSize: '3rem', color: '#334155', mb: 2}}/>
                    <Typography variant="h6" sx={{color: '#64748b', mb: 1}}>
                        No servers yet
                    </Typography>
                    <Typography variant="body2" sx={{color: '#475569', mb: 3}}>
                        Create your first Arma Reforger server to get started
                    </Typography>
                    <Button
                        component={Link}
                        to="/servers/new/REFORGER"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon/>}
                    >
                        Create Server
                    </Button>
                </Box>
            ) : (
                <Stack spacing={1.5}>
                    {serverInstances.map(instance =>
                        <ServerListEntry key={instance.server.id}
                                         server={instance.server}
                                         status={instance.status}
                                         onStartServer={handleStartServer}
                                         onStopServer={handleStopServer}
                                         onRestartServer={handleRestartServer}
                                         onDuplicateServer={handleDuplicateServer}
                                         onOpenLogs={handleOpenLogs}
                                         onDeleteServer={() => handleDeleteServerClicked(instance.server)}
                                         serverWithSamePortRunning={isServerWithSamePortRunning(instance.server)}
                        />
                    )}
                </Stack>
            )}

            {serverToDelete && <ConfirmationDialog
                open={deleteDialogOpen} title={`Delete server '${serverToDelete.name}'?`}
                description={"Deleting the server will cause all of its configuration to be permanently lost."}
                onConfirm={handleDeleteServer} onClose={handleDeleteDialogClose} actionLabel="Delete"
            />}
        </Box>
    );
}

export default ServersPage;