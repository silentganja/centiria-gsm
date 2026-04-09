<div align="center">
  <img src="./frontend/src/assets/reforger_logo.jpg" alt="Centiria GSM Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # 🛡️ Centiria GSM
  ### Next-Generation Game Server Management for Arma Reforger

  <p align="center">
    <img src="https://img.shields.io/badge/Version-2.0.0-00e87b?style=for-the-badge&logoColor=white" alt="Version 2.0.0" />
    <img src="https://img.shields.io/badge/Platform-Ubuntu_22.04-38bdf8?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready" />
    <img src="https://img.shields.io/badge/Arma%20Reforger-Supported-red?style=for-the-badge&logoColor=white" alt="Arma Reforger" />
  </p>

  <p align="center">
    <b>A premium, high-performance web-based administration tool for deploying, managing, and monitoring Arma Reforger dedicated servers on your VPS.</b>
  </p>
</div>

<br />

## ✨ Features Overview

Centiria GSM brings enterprise-grade management capabilities to your Arma Reforger servers with a stunning "Military Command Center" aesthetic.

### 🎮 Server Operations
- **Full Lifecycle Management**: Create, start, stop, kill, and auto-restart servers.
- **Multi-Server Architecture**: Run multiple server instances from a single panel.
- **Port Management**: Automated port assignment and conflict prevention.
- **JSON Configuration Engine**: Configure server parameters without touching raw JSON files.

### 🧩 Workshop & Mod Integration (V2)
- **Mod Browser**: Browse, search, and install mods directly from the Steam Workshop.
- **Mod Collections**: Organize mods into reusable, taggable collections.
- **Curated Mod Packs**: 5 built-in, pre-tested mod pack templates (Realism, Modern Warfare, Asymmetric, etc.) containing up to 20 mods each for instant deployment.
- **Custom Templates**: Build and save your own mod pack templates.
- **Preset Management**: Load entire mod configurations with a single click.

### 📊 Real-Time Telemetry & Monitoring
- **Live Metrics Dashboard**: Track CPU, Memory, and Storage utilization in real-time.
- **Sparkline Charts**: Visualize performance trends over time.
- **Activity Log**: Persistent timeline tracking all server events, installations, and system activities.
- **Server Health**: Instant status of all running servers and connected player counts.

### 🛠️ Developer & Admin Tools
- **Live Console Access**: Interact directly with the server console in real-time.
- **Mission Management**: Upload, organize, and deploy custom Arma Reforger scenarios (`.ent` files).
- **Log Viewer**: Stream and analyze server logs dynamically.
- **App Configuration**: Manage API keys, paths, and update settings from the UI.

---

## 🎨 Interface Showcase

Our platform features a **Brutalist / Glassmorphism** design system—dark themes, dynamic GSAP kinetic animations, and responsive layouts built to feel like a high-end military operations center.

| **Dashboard** | **Workshop Management** |
|:---:|:---:|
| System resources, active servers, and installation status at a glance. | Full integration with Steam Workshop, Mod Packs, and Collections. |

| **Real-Time Monitoring** | **Console Integration** |
|:---:|:---:|
| Live CPU/RAM metrics, sparklines, and unified activity logs. | Direct access to the Arma Reforger server console for live debugging. |

---

## ⚡ Deployment in One Command

Centiria GSM features an **Interactive Deployment Wizard** that fully configures your Linux environment, installs dependencies, sets up Docker, generates secure credentials, and provisions an automated SSL reverse proxy.

### Prerequisites
- **OS**: Ubuntu 22.04 LTS (Required)
- **Hardware**: Minimum 4GB RAM (8GB+ recommended), 50GB+ Storage space.
- **Network**: A domain (e.g., `centiria.my`) pointing to your VPS IP (Optional, required for SSL).
- **Access**: Root privileges.

### The Magic Command

SSH into your VPS and run the following command as `root`:

```bash
sudo bash -c "$(curl -sSL https://raw.githubusercontent.com/silentganja/centiria-gsm/main/deploy.sh)"
```

### The Setup Wizard
The automated installer will interactively prompt you for:
1. **Domain Name** (for automatic Nginx + SSL configuration).
2. **Admin Credentials** (Secure password generation).
3. **Database Credentials** (Auto-generation available).
4. **Steam API Key** (optional during setup).
5. **Timezone**.

Once complete, it handles system updates, firewall configuration (UFW), directory structuring, and container deployment.

---

## 🚀 Post-Installation Guide

1. **Access the Panel**: Navigate to `https://your-domain.com` (or `http://YOUR_VPS_IP:8080`).
2. **Authenticate**: Log in using the `admin` account and the password you set during deployment.
3. **Configure Steam Guard**:
   - Go to **App Config**.
   - Input your Steam Username & Password.
   - Run the initial SteamCMD login to generate your Steam Guard token.
4. **Install Arma Reforger**:
   - Return to the **Dashboard**.
   - Click **Install / Update Game Server**.
5. **Create & Play**:
   - Navigate to **Map Server / Servers**.
   - Create your first configuration.
   - Start the server!

---

## 🔧 Management Commands

A quick reference for VPS administrators using the Centiria GSM ecosystem. All commands should be run from `/opt/centiria-gsm`.

```bash
# Start all platform services in the background
docker compose up -d

# Stop all services gracefully
docker compose down

# Stream live container logs
docker compose logs -f

# Completely update the platform to the latest version
git pull && docker compose pull && docker compose up -d

# View your initially generated credentials
cat /opt/centiria-gsm/CREDENTIALS.txt
```

---

## ⚙️ Architecture & Tech Stack

Centiria GSM is built using a modern, scalable microservice architecture aimed at enterprise performance:

- **Frontend**: React 18, Vite, TypeScript, Material-UI (MUI v5)
- **Backend / Core**: Spring Boot 3.3 (Java 17), Hibernate ORM
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Nginx, Let's Encrypt (Certbot)
- **Integration Layer**: Custom SteamCMD wrappers, JSON Schema translators for Arma Reforger config files.

---

## 📜 Credits & Acknowledgments

* Originally based on the foundational framework of [fugasjunior/arma-server-manager](https://github.com/fugasjunior/arma-server-manager).
* Extensively redesigned, rewritten, and modernized by **Centiria**.
* UI/UX powered by the **Industrial Bronze & Slate** design systems.

<div align="center">
  <br/>
  <i>Engineered for the MilSim community by <b>Centiria</b>.</i><br/>
  <a href="https://centiria.my">centiria.my</a>
</div>
