import {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {login} from "../../services/authService";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import {AuthContext} from "../../store/auth-context";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const data = await login(username, password);
            authCtx.login(data.token, data.expiresIn * 1000);
            navigate("/");
        } catch {
            setError("Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUsername(e.target.value);
        setError("");
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setPassword(e.target.value);
        setError("");
    };

    if (authCtx.isLoggedIn) {
        navigate("/");
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#06090f',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0, 232, 123, 0.08) 0%, transparent 70%)',
                        animation: 'breathe 8s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-15%',
                        right: '-5%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)',
                        animation: 'breathe 10s ease-in-out infinite 2s',
                    },
                }}
            />

            {/* Grid pattern overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Login Card */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '420px',
                    mx: 3,
                    animation: 'fadeIn 0.6s ease',
                }}
            >
                <Box
                    sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: '20px',
                        background: 'rgba(17, 24, 39, 0.5)',
                        backdropFilter: 'blur(30px) saturate(200%)',
                        border: '1px solid rgba(148, 163, 184, 0.08)',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Logo */}
                    <Stack alignItems="center" spacing={1} mb={4}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #00e87b 0%, #00b35f 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 232, 123, 0.3)',
                                mb: 1,
                            }}
                        >
                            <SportsEsportsIcon sx={{color: '#06090f', fontSize: 28}}/>
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Centiria GSM
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#64748b',
                                fontSize: '0.85rem',
                            }}
                        >
                            Sign in to manage your servers
                        </Typography>
                    </Stack>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                label="Username"
                                required
                                fullWidth
                                value={username}
                                onChange={handleUsernameChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon sx={{color: '#64748b', fontSize: '1.2rem'}}/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                label="Password"
                                required
                                fullWidth
                                value={password}
                                onChange={handlePasswordChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{color: '#64748b', fontSize: '1.2rem'}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                sx={{color: '#64748b'}}
                                            >
                                                {showPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {error && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#ef4444',
                                        fontSize: '0.8rem',
                                        textAlign: 'center',
                                        animation: 'fadeIn 0.3s ease',
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={isLoading}
                                sx={{
                                    py: 1.5,
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    mt: 1,
                                    position: 'relative',
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{color: '#06090f'}}/>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </Stack>
                    </form>

                    {/* Footer */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            mt: 3,
                            color: '#475569',
                            fontSize: '0.7rem',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        Powered by Centiria
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;