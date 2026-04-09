import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getServer, getServerStatus, updateServer} from "../services/serversService";
import {toast} from "material-react-toastify";
import {Box, Stack, Typography} from "@mui/material";
import EditReforgerServerSettingsForm from "../components/servers/EditReforgerServerSettingsForm";
import {ReforgerServerDto, ServerDto} from "../dtos/ServerDto";

const ServerSettingsPage = () => {
    const {id} = useParams();
    const [server, setServer] = useState<ServerDto>();
    const [status, setStatus] = useState<ServerInstanceInfoDto>();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const {data: fetchedServer} = await getServer(Number(id));
            setServer(fetchedServer);

            const {data: serverStatus} = await getServerStatus(Number(id));
            setStatus(serverStatus);

            setIsLoading(false);
        } catch (e) {
            console.error(e);
            toast("Error while loading server data");
        }
    }

    const handleSubmit = async (values: ServerDto) => {
        if (!server) return;

        const request = {
            ...server,
            ...values,
            type: server.type,
            queryPort: values.queryPort
        }

        try {
            await updateServer(Number(id), request);
            toast.success("Server successfully updated");
            navigate("/servers");
        } catch (e) {
            console.error(e);
        }
    }

    const handleCancel = () => {
        navigate("/servers");
    }

    return (
        <Box className="page-content">
            {isLoading && (
                <Box
                    sx={{
                        p: 6,
                        borderRadius: '16px',
                        background: 'rgba(17, 24, 39, 0.4)',
                        border: '1px solid rgba(148, 163, 184, 0.08)',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{color: '#64748b'}}>
                        Loading server data...
                    </Typography>
                </Box>
            )}
            {!isLoading && !!server && (
                <>
                    <Stack spacing={0.5} mb={3}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Server Settings
                        </Typography>
                        <Typography variant="body2" sx={{color: '#64748b'}}>
                            Configure {server.name}
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
                        <EditReforgerServerSettingsForm
                            server={server as ReforgerServerDto}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isServerRunning={status && status.alive}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ServerSettingsPage;