<div align="center">
  <img src="https://raw.githubusercontent.com/silentganja/centiria-gsm/main/frontend/src/assets/reforger_logo.jpg" alt="Centiria GSM Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

# 🛡️ Centiria GSM

### Next-Generation Game Server Management for Arma Reforger

  <p align="center">
    <img src="https://img.shields.io/badge/Version-2.1.0-00e87b?style=for-the-badge&logoColor=white&logo=checkmarx" alt="Version 2.1.0" />
    <img src="https://img.shields.io/badge/Platform-Ubuntu_22.04-38bdf8?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
    <img src="https://img.shields.io/badge/Engine-Enfusion-red?style=for-the-badge&logoColor=white" alt="Arma Reforger" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready" />
    <img src="https://img.shields.io/badge/Code-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/UI-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/API-Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
  </p>

  <p align="center">
    <b>A premium, high-performance web-based administration tool for deploying, managing, and monitoring Arma Reforger dedicated servers on your VPS. Built with a stunning Brutalist/Glassmorphism interface and native Bohemia Workshop integration.</b>
  </p>

  <p align="center">
    <a href="#-features-overview">Features</a> •
    <a href="#-interface-showcase">Showcase</a> •
    <a href="#-deployment-in-one-command">Installation</a> •
    <a href="#-post-installation-guide">Setup Guide</a> •
    <a href="#-architecture--tech-stack">Tech Stack</a> •
    <a href="#-bohemia-workshop-integration">Workshop</a>
  </p>
</div>

<br />

---

## ✨ Features Overview

Centiria GSM brings enterprise-grade management capabilities to your Arma Reforger servers. Instead of fighting with JSON files and Linux command lines, manage your entire community from a stunning **"Military Command Center"** dashboard.

### 🎮 Server Operations & Enterprise Limits

> **Deployment Lock**: Centiria GSM enforces a strict **1 VPS = 1 Server Mode** to guarantee peak performance, prevent game-port crossovers, and ensure dedicated resource allocation. 

- **Full Lifecycle Management**: Create, start, stop, kill, and auto-restart your dedicated instance.
- **Crossplay Ready**: Built-in support to configure `PLATFORM_XBL` (Xbox Live) crossplay straight from the UI.
- **Intelligent Configuration**: Fully manages game ports, query ports, and RCON ports automatically.
- **JSON Configuration Engine**: Configure server parameters, passphrases, and admin lists without touching raw JSON files.
- **Automated Scheduling**: Set up precise daily restart schedules to keep the instance fresh.
- **Anonymous SteamCMD Download**: Base server files are downloaded via SteamCMD using anonymous login. No Steam account required.

### 🌐 Bohemia Workshop Integration (V2.1)

> **New in V2.1**: Centiria GSM now integrates directly with the **Bohemia Interactive Workshop** at `reforger.armaplatform.com`. No Steam API Key, no Steam Account, and no Steam Guard tokens required.

- **Live Workshop Browser**: Look up any Arma Reforger mod by its Bohemia hex GUID directly from the admin panel.
- **One-Click Registration**: Preview mod details (name, author, description, thumbnail) and register mods for your server with a single click.
- **Native Mod Downloading**: Registered mods are automatically downloaded by the Arma Reforger server executable on startup via the Bohemia backend. Zero manual file management.
- **Smart Mod Collections**: Organize your mods into reusable, taggable custom collections.
- **Curated Mod Packs**: 5 built-in, pre-tested mod pack templates containing up to 20 mods each:
  - 🎯 **Realism & MilSim**: Hardcore tactical combat and medical frameworks.
  - ⚔️ **Modern Warfare**: Modern hardware, JLTVs, Strykers, and advanced weapons.
  - 🌄 **Immersion**: Cinematic weather, atmospheric sounds, and better visuals.
  - 🎮 **Co-op & Casual**: Perfect QoL improvements for playing with friends.
  - 🏜️ **Asymmetric Warfare**: Setup insurgency-style combat missions.
- **Custom Templates**: Build, save, and share your own mod pack templates.
- **Preset Management**: Load entire mod execution configurations with a single click.

### 📊 Real-Time Telemetry & Monitoring

- **Live Metrics Dashboard**: Track CPU, Memory, and Storage utilization in real-time.
- **Kinetic Sparkline Charts**: Visualize performance trends over the last 30 samples.
- **Unified Activity Log**: Persistent timeline tracking all server events, Mod installations, and system activities.
- **Server Health Oracle**: Instant visual status glow on all running servers and active connected player counts.

### 🛠️ Developer & Admin Tools

- **Live Console Access**: Interact directly with the server terminal in real-time. Execute RCON-style commands instantly.
- **Mission Management**: Upload, organize, and deploy custom Arma Reforger scenarios (`.ent` files).
- **Log Viewer**: Stream, tail, and analyze server logs dynamically with syntax coloring.
- **System Settings**: View platform configuration status and Bohemia integration health.

---

## 🌐 Bohemia Workshop Integration

### How it Works

Arma Reforger uses a fundamentally different architecture from Arma 3 and DayZ for mod management:

```
┌──────────────────────────────────────────────────────────────┐
│                    CENTIRIA GSM PANEL                        │
│                                                              │
│  1. Admin browses Bohemia Workshop via the panel             │
│  2. Admin clicks "Add to Server" on a mod                    │
│  3. Panel scrapes mod metadata from armaplatform.com         │
│  4. Mod GUID is injected into server.json config             │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                 ARMA REFORGER SERVER                          │
│                                                              │
│  5. On startup, server reads server.json                     │
│  6. Server contacts Bohemia backend directly                 │
│  7. All listed mods are downloaded/updated automatically     │
│  8. Server comes online with mods ready                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Key Differences from Arma 3

| Feature | Arma 3 (Legacy) | Arma Reforger (Centiria GSM) |
|---------|-----------------|------------------------------|
| Mod Download | SteamCMD + Steam Account | Native server executable |
| Authentication | Steam Guard + API Key | None required |
| Mod IDs | Numeric Steam Workshop IDs | Hex GUIDs (e.g. `595F2BF2F44836FB`) |
| Metadata Source | Steam Workshop API | Bohemia Workshop scraper |
| Version Management | Manual | Automatic (latest on each startup) |

### Finding Mod IDs

1. Open [reforger.armaplatform.com/workshop](https://reforger.armaplatform.com/workshop)
2. Click on any mod
3. The hex GUID is in the URL: `https://reforger.armaplatform.com/workshop/595F2BF2F44836FB-RHS-StatusQuo`
4. Copy `595F2BF2F44836FB` and paste it into the Centiria GSM **Browse Workshop** tab

---

## 🎨 Interface Showcase

Our platform ditches standard utilitarian admin panels. We built Centiria GSM using a **Brutalist / Glassmorphism** design system — featuring deep dark mode aesthetics, dynamic GSAP kinetic animations, blurred backdrops, moving atmospheric mesh grids, and responsive layouts built to feel like a high-end, **"alive"** military operations center.

|                                                   🎛️ **Command Dashboard**                                                   |                                               📦 **Workshop Management**                                               |
| :--------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| System resources, active servers, recent activity, and installation status at a glance. Beautiful metrics and quick actions. | Full integration with Bohemia Workshop. Browse mods, manage Mod Packs, Collections, and Presets from one unified tab. |

|                                   📈 **Real-Time Telemetry**                                    |                                     💻 **Console Integration**                                     |
| :---------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
| Live CPU/RAM metrics, kinetic sparklines, resource bars, and unified color-coded activity logs. | Direct streaming access to the Arma Reforger server console for live debugging and admin commands. |

<details>
<summary><b>Click to see Design System details</b></summary>

- **Color Palette**: Industrial Slate (`#0f172a`), accented heavily with Neon Green (`#00e87b`) and Electric Blue (`#38bdf8`).
- **Typography**: `Inter` for extremely readable UI text, paired with `JetBrains Mono` for logs, Workshop IDs, and telemetry data.
- **Effects**: Heavy use of `backdrop-filter: blur(20px)`, subtle gradient borders, and micro-hover states to increase tactile feedback.

</details>

---

## ⚡ Deployment in One Command

We designed Centiria GSM to be installed by anyone, regardless of Linux experience. Our **Interactive Deployment Wizard** fully configures your Linux environment, installs dependencies, sets up Docker, generates secure credentials, and provisions an automated SSL reverse proxy automatically.

### Prerequisites

- **OS**: Ubuntu 22.04 LTS (Strictly Recommended).
- **Hardware**: Minimum 4GB RAM (8GB+ highly recommended), 50GB+ Storage space.
- **Network**: A domain (e.g., `centiria.my`) pointing to your VPS IP (Optional, but required for HTTPS/SSL).
- **Access**: `root` privileges.

> **Note**: No Steam Account, Steam API Key, or Steam Guard token is required. Arma Reforger server files are downloaded anonymously via SteamCMD, and all mods are handled natively by the Bohemia backend.

### The Magic Command

SSH into your fresh VPS and run the following command as `root`:

```bash
sudo bash -c "$(curl -sSL https://raw.githubusercontent.com/silentganja/centiria-gsm/main/deploy.sh)"
```

### 🧙‍♂️ The Setup Wizard

The automated installer will interactively prompt you for:

| Step | Prompt | Description |
|------|--------|-------------|
| **1** | Domain Name | For automatic Nginx + SSL configuration. Leave blank if you don't have a domain. |
| **2** | Admin Credentials | Set your Web UI login username and password (or let the system auto-generate a secure one). |
| **3** | Database Credentials | For the internal MySQL structure (auto-generation available). |
| **4** | Timezone | Set your operating timezone for logs and auto-restarts. Default: `Asia/Kuala_Lumpur`. |

Once you confirm the summary, the installer handles:
- ✅ System updates & dependency installation
- ✅ Firewall configuration (UFW) with Arma Reforger game ports
- ✅ Directory structuring & Git clone
- ✅ Nginx reverse proxy setup
- ✅ Let's Encrypt SSL certification
- ✅ Docker Compose deployment
- ✅ Systemd auto-start service creation

---

## 🚀 Post-Installation Guide

You are **5 minutes** away from playing. Follow these steps after the script finishes:

### Step 1: Access the Panel
Navigate to `https://your-domain.com` (or `http://YOUR_VPS_IP:8080` if no domain configured).

### Step 2: Authenticate
Log in using the admin credentials you set during the deployment wizard.

### Step 3: Install Arma Reforger Core
- Return to the **Dashboard**.
- Click the flashing green **Install / Update Game Server** button.
- Wait for SteamCMD to finish downloading the base server files (~2GB). This uses anonymous login, no Steam account needed.

### Step 4: Add Your Mods
- Navigate to the **Workshop** tab.
- Click **Browse Workshop**.
- Enter any Bohemia hex GUID (e.g., `595F2BF2F44836FB` for RHS: Status Quo).
- Click **Look Up** to preview the mod details.
- Click **Add to Server** to register the mod.
- Repeat for all desired mods, or use the **Mod Packs** tab for curated templates.

### Step 5: Create & Play
- Navigate to the **Servers** tab.
- Click **Create Server**. Set your server name, max players, and password.
- Hit **Start**! The server will automatically download all registered mods from Bohemia's backend on first launch.

> **Tip**: Check the server console output for `[DownloadManager] Downloading addon...` messages confirming mod downloads.

---

## 🔧 Management Commands

A quick reference for VPS administrators using the Centiria GSM ecosystem. All commands should be run from `/opt/centiria-gsm`.

```bash
# Start all platform services in the background
sudo docker compose up -d

# Stop all services gracefully
sudo docker compose down

# Stream live container logs (Useful for debugging the panel itself)
sudo docker compose logs -f

# Completely update the platform to the latest version on GitHub
git pull && sudo docker compose pull && sudo docker compose up -d

# View your initially generated credentials (DELETE this file if you already saved them!)
cat /opt/centiria-gsm/CREDENTIALS.txt
```

---

## ⚙️ Architecture & Tech Stack

Centiria GSM is built using a modern, scalable microservice architecture aimed at enterprise performance:

### Frontend

- **Framework**: React 18 / Vite
- **Language**: TypeScript
- **State/Routing**: React Router DOM
- **UI Library**: Material-UI (MUI v5)
- **Styling**: Emotion / Vanilla CSS / GSAP Animations

### Backend Core

- **Framework**: Spring Boot 3.3
- **Language**: Java 17
- **Database Mapping**: Hibernate ORM
- **Security**: JWT Authentication, Spring Security
- **Workshop Integration**: Custom HTML scraper for `reforger.armaplatform.com`

### Infrastructure

- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Security**: Let's Encrypt (Certbot), UFW Firewall
- **Integration Layer**: Anonymous SteamCMD for base server, Bohemia native mod downloads, JSON Schema translators for Enfusion engine configurations.

### Data Flow

```
User (Browser) ──── React SPA ──── /api/* ──── Spring Boot ──┬── MySQL (state)
                                                              ├── SteamCMD (anonymous, server files only)
                                                              ├── Bohemia Workshop Scraper (mod metadata)
                                                              └── ArmaReforgerServer (native mod downloads)
```

---

## 🛡️ Security Considerations

- **JWT Authentication**: All API endpoints are protected with JSON Web Token authentication.
- **AES-256 Encryption**: Sensitive database fields are encrypted at rest.
- **UFW Firewall**: Only required ports are exposed (SSH, HTTP, HTTPS, Game ports).
- **No Steam Credentials Stored**: Unlike legacy tools, Centiria GSM stores zero Steam account passwords or tokens.
- **File Permissions**: Configuration files (``.env``, ``CREDENTIALS.txt``) are set to ``600`` (owner-only access).

---

## 📜 Credits & Acknowledgments

- Originally based on the incredibly robust foundational backend framework of [fugasjunior/arma-server-manager](https://github.com/fugasjunior/arma-server-manager).
- Extensively redesigned, rewritten, and modernized by **Centiria**.
- UI/UX powered by Centiria's internal **Industrial Bronze & Slate** design systems.
- Workshop integration powered by data from [reforger.armaplatform.com](https://reforger.armaplatform.com/workshop).

---

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/silentganja/centiria-gsm/main/frontend/src/assets/reforger_logo.jpg" width="100px" style="border-radius: 5px; opacity: 0.8;" />
  <br/><br/>
  <i>Engineered for the MilSim community by <b>Centiria Operations</b>.</i><br/>
  <a href="https://centiria.my" style="color: #00e87b; text-decoration: none; font-weight: bold;">centiria.my</a>
  <br/><br/>
  <p style="color: #64748b; font-size: 0.8em;">© 2026 Centiria. All rights reserved.</p>
</div>
