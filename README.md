# Centiria GSM
### Game Server Management for Arma Reforger

A premium web-based administration tool for managing **Arma Reforger** dedicated servers on your VPS.

## Features

- **Server Management** - Create, configure, start, stop, and restart Arma Reforger servers
- **Steam Workshop Mods** - Install and manage mods directly from Steam Workshop
- **Scenario Management** - Upload and manage mission scenarios
- **System Dashboard** - Real-time CPU, memory, and storage monitoring
- **Automatic Restarts** - Schedule daily server restarts
- **Server Logs** - View and download server logs
- **Modern UI** - Premium dark theme with glassmorphism design

## One-Command VPS Deployment

### Prerequisites
- Ubuntu 22.04 LTS VPS (4GB+ RAM, 50GB+ storage recommended)
- Domain pointing to your VPS (optional, for HTTPS)

### Quick Install

```bash
# SSH into your VPS, then run:
sudo bash -c "$(curl -sSL https://raw.githubusercontent.com/silentganja/centiria-gsm/main/deploy.sh)"
```

This script will automatically:
1. Install Docker and Docker Compose
2. Configure UFW firewall (ports 80, 443, 8080, 2001/udp, 17777/udp)
3. Generate secure passwords and JWT secrets
4. Set up Nginx reverse proxy with SSL (Let's Encrypt)
5. Start all services
6. Display your login credentials

### After Installation

1. **Log in** to the web UI at `https://your-domain.com` or `http://VPS_IP:8080`
2. **Add Steam API Key** - Generate at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
3. **Settings** > Enter your Steam username, password, and Steam Guard token
4. **Dashboard** > Click "Install" to download Arma Reforger server files
5. **Servers** > Create a new Reforger server and start it

## Management Commands

```bash
# Start services
cd /opt/centiria-gsm && docker compose up -d

# Stop services
cd /opt/centiria-gsm && docker compose down

# View logs
cd /opt/centiria-gsm && docker compose logs -f

# Update
cd /opt/centiria-gsm && git pull && docker compose pull && docker compose up -d

# View credentials
cat /opt/centiria-gsm/CREDENTIALS.txt
```

## Configuration

Environment variables are stored in `/opt/centiria-gsm/.env`. Key settings:

| Variable | Description |
|----------|-------------|
| `AUTH_USERNAME` | Web UI login username |
| `AUTH_PASSWORD` | Web UI login password |
| `STEAM_API_KEY` | Steam API key for Workshop |
| `TIMEZONE` | Server timezone (default: Asia/Kuala_Lumpur) |

## Tech Stack

- **Backend**: Spring Boot 3.3 (Java 17) + MySQL 8
- **Frontend**: React 18 + TypeScript + Vite + MUI 5
- **Deployment**: Docker + Nginx + Let's Encrypt
- **Game Integration**: SteamCMD

## Credits

Based on [fugasjunior/arma-server-manager](https://github.com/fugasjunior/arma-server-manager).  
Customized and rebranded by [Centiria](https://centiria.my).
