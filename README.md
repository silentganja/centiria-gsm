<div align="center">
  <img src="https://raw.githubusercontent.com/silentganja/centiria-gsm/main/frontend/src/assets/reforger_logo.jpg" alt="Centiria GSM Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

# 🛡️ Centiria GSM

### Next-Generation Game Server Management for Arma Reforger

  <p align="center">
    <img src="https://img.shields.io/badge/Version-2.0.0-00e87b?style=for-the-badge&logoColor=white&logo=checkmarx" alt="Version 2.0.0" />
    <img src="https://img.shields.io/badge/Platform-Ubuntu_22.04-38bdf8?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
    <img src="https://img.shields.io/badge/Engine-Enfusion-red?style=for-the-badge&logoColor=white" alt="Arma Reforger" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready" />
    <img src="https://img.shields.io/badge/Code-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/UI-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/API-Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
  </p>

  <p align="center">
    <b>A premium, high-performance web-based administration tool for deploying, managing, and monitoring Arma Reforger dedicated servers on your VPS. Built with a stunning Brutalist/Glassmorphism interface.</b>
  </p>

  <p align="center">
    <a href="#-features-overview">Features</a> •
    <a href="#-interface-showcase">Showcase</a> •
    <a href="#-deployment-in-one-command">Installation</a> •
    <a href="#-post-installation-guide">Setup Guide</a> •
    <a href="#-architecture--tech-stack">Tech Stack</a>
  </p>
</div>

<br />

---

## ✨ Features Overview

Centiria GSM brings enterprise-grade management capabilities to your Arma Reforger servers. Instead of fighting with JSON files and Linux command lines, manage your entire community from a stunning **"Military Command Center"** dashboard.

### 🎮 Server Operations

- **Full Lifecycle Management**: Create, start, stop, kill, and auto-restart servers instantly.
- **Multi-Server Architecture**: Run and manage multiple server instances from a single unified panel.
- **Intelligent Port Management**: Automated port assignment and conflict prevention across all instances.
- **JSON Configuration Engine**: Configure server parameters, passwords, and admin lists without touching raw JSON files.
- **Automated Scheduling**: Set up precise daily restart schedules to keep servers fresh.

### 🧩 Workshop & Mod Integration (V2)

- **Mod Browser**: Browse, search, and install mods directly from the Steam Workshop.
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
- **App Configuration**: Manage Steam Guard tokens, API keys, paths, and application update settings right from the UI.

---

## 🎨 Interface Showcase

Our platform ditches standard utilitarian admin panels. We built Centiria GSM using a **Brutalist / Glassmorphism** design system—featuring deep dark mode aesthetics, dynamic GSAP kinetic animations, blurred backdrops, and responsive layouts built to feel like a high-end military operations center.

|                                                   🎛️ **Command Dashboard**                                                   |                                               📦 **Workshop Management**                                               |
| :--------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| System resources, active servers, recent activity, and installation status at a glance. Beautiful metrics and quick actions. | Full integration with Steam Workshop. Manage Mod Packs, Collections, Presets, and visualize massive mod installations. |

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

### The Magic Command

SSH into your fresh VPS and run the following command as `root`:

```bash
sudo bash -c "$(curl -sSL https://raw.githubusercontent.com/silentganja/centiria-gsm/main/deploy.sh)"
```

### 🧙‍♂️ The Setup Wizard

The automated installer will interactively prompt you for:

1. **Domain Name**: For automatic Nginx + SSL configuration (Leave blank if you don't have a domain).
2. **Admin Credentials**: Set your specific Web UI login password (or let the system generate a secure one).
3. **Database Credentials**: For the internal MySQL structure (Auto-generation available).
4. **Steam API Key**: (Optional during setup, can be added later).
5. **Timezone**: Set your operating timezone for logs and auto-restarts.

Once you confirm the summary, the installer handles system updates, firewall configuration (UFW), directory structuring, Nginx setup, Let's Encrypt certification, and complete container deployment.

---

## 🚀 Post-Installation Guide

You are 5 minutes away from playing. Follow these steps after the script finishes:

1. **Access the Panel**: Navigate to `https://your-domain.com` (or `http://YOUR_VPS_IP:8080`).
2. **Authenticate**: Log in using the `admin` account and the password you set during the deployment wizard.
3. **Configure Steam Guard**:
   - Go to **App Config**.
   - Input your Steam Username & Password (this is required to download Arma Reforger server files).
   - _Note: Arma Reforger server requires a valid Steam account._
4. **Install Arma Reforger Core**:
   - Return to the **Dashboard**.
   - Click the flashing green **Install / Update Game Server** button. Wait for SteamCMD to finish.
5. **Create & Play**:
   - Navigate to the **Servers** tab.
   - Click **Create Server**. Set your server name, max players, and password.
   - Hit **Start**!

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

### Infrastructure

- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Security**: Let's Encrypt (Certbot), UFW Firewall
- **Integration Layer**: Custom SteamCMD wrappers, JSON Schema translators for Enfusion engine configurations.

---

## 📜 Credits & Acknowledgments

- Originally based on the incredibly robust foundational backend framework of [fugasjunior/arma-server-manager](https://github.com/fugasjunior/arma-server-manager).
- Extensively redesigned, rewritten, and modernized by **Centiria**.
- UI/UX powered by Centiria's internal **Industrial Bronze & Slate** design systems.

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
