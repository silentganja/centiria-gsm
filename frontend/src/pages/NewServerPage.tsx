import {useNavigate, useParams} from "react-router-dom";
import {createServer, getServers} from "../services/serversService";
import {toast} from "material-react-toastify";
import {Box, Stack, Typography} from "@mui/material";
import EditReforgerServerSettingsForm from "../components/servers/EditReforgerServerSettingsForm";
import {reforgerServerInitialState} from "./initialServerStateCreator";
import {useEffect} from "react";

const NewServerPage = () => {
    const {type} = useParams<{ type: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        getServers().then(({data}) => {
            if (data.servers.length >= 1) {
                toast.error("Deployment limit reached. Only 1 server per VPS is allowed.");
                navigate("/servers");
            }
        });
    }, [navigate]);

    const handleSubmit = async (values: import("../dtos/ServerDto").ReforgerServerDto) => {
        const server = {
            ...values,
            type: type ?? "REFORGER",
            activeMods: [],
            activeDLCs: [],
        }

        try {
            await createServer(server);
            toast.success("Server successfully created");
            navigate("/servers");
        } catch (e) {
            console.error(e);
            toast.error("Creating server failed");
        }
    };

    const handleCancel = () => {
        navigate("/servers");
    };

    return (
        <Box className="page-content">
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
                    New Arma Reforger Server
                </Typography>
                <Typography variant="body2" sx={{color: '#64748b'}}>
                    Configure and deploy a new server instance
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
                    server={reforgerServerInitialState()}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            </Box>
        </Box>
    );
}

export default NewServerPage;