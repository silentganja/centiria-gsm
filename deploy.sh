#!/bin/bash
# =============================================================================
# Centiria GSM - One-Command VPS Deployment Script
# Game Server Management for Arma Reforger
# Tested on: Ubuntu 22.04 LTS
# Usage: sudo bash deploy.sh
# =============================================================================

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Config ──────────────────────────────────────────────────────────────────
INSTALL_DIR="/opt/centiria-gsm"
STORAGE_DIR="/home/centiria-gsm/storage"
REPO_URL="https://github.com/silentganja/centiria-gsm.git"

# ─── Functions ───────────────────────────────────────────────────────────────
banner() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║    ${BOLD}Centiria GSM${NC}${GREEN} - Game Server Management                   ║${NC}"
    echo -e "${GREEN}║    Interactive VPS Deployment                                ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

generate_secret() {
    openssl rand -hex "$1" 2>/dev/null || head -c "$1" /dev/urandom | xxd -p | head -c $(($1 * 2))
}

generate_aes_key() {
    openssl rand -hex 16 2>/dev/null || head -c 16 /dev/urandom | xxd -p | head -c 32
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run as root. Use: sudo bash deploy.sh"
        exit 1
    fi
}

# ─── Interactive Setup Prompt ────────────────────────────────────────────────
collect_user_config() {
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Step 1: Domain & Network Configuration${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Domain
    read -rp "$(echo -e "${CYAN}Enter your domain${NC} (e.g. centiria.my, leave empty to skip Nginx/SSL): ")" INPUT_DOMAIN
    DOMAIN="${INPUT_DOMAIN:-}"

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Step 2: Login Panel Credentials${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  These credentials will be used to log into the Centiria GSM web panel."
    echo ""

    # Username
    read -rp "$(echo -e "${CYAN}Panel username${NC} [default: admin]: ")" INPUT_USERNAME
    AUTH_USERNAME="${INPUT_USERNAME:-admin}"

    # Password
    while true; do
        read -srp "$(echo -e "${CYAN}Panel password${NC} (min 8 chars): ")" INPUT_PASSWORD
        echo ""
        if [ -z "$INPUT_PASSWORD" ]; then
            INPUT_PASSWORD=$(generate_secret 12)
            echo -e "  ${YELLOW}No password entered. Generated secure password:${NC} ${BOLD}${INPUT_PASSWORD}${NC}"
            AUTH_PASSWORD="$INPUT_PASSWORD"
            break
        elif [ ${#INPUT_PASSWORD} -lt 8 ]; then
            log_error "Password must be at least 8 characters. Try again."
        else
            read -srp "$(echo -e "${CYAN}Confirm password${NC}: ")" CONFIRM_PASSWORD
            echo ""
            if [ "$INPUT_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
                log_error "Passwords do not match. Try again."
            else
                AUTH_PASSWORD="$INPUT_PASSWORD"
                break
            fi
        fi
    done

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Step 3: Database Configuration${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # DB password
    read -srp "$(echo -e "${CYAN}Database password${NC} (leave empty to auto-generate): ")" INPUT_DB_PASSWORD
    echo ""
    if [ -z "$INPUT_DB_PASSWORD" ]; then
        MYSQL_PASSWORD=$(generate_secret 16)
        echo -e "  ${YELLOW}Auto-generated database password${NC}"
    else
        MYSQL_PASSWORD="$INPUT_DB_PASSWORD"
    fi

    # DB root password
    read -srp "$(echo -e "${CYAN}Database root password${NC} (leave empty to auto-generate): ")" INPUT_DB_ROOT_PASSWORD
    echo ""
    if [ -z "$INPUT_DB_ROOT_PASSWORD" ]; then
        MYSQL_ROOT_PASSWORD=$(generate_secret 16)
        echo -e "  ${YELLOW}Auto-generated database root password${NC}"
    else
        MYSQL_ROOT_PASSWORD="$INPUT_DB_ROOT_PASSWORD"
    fi

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Step 4: Timezone${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    read -rp "$(echo -e "${CYAN}Timezone${NC} [default: Asia/Kuala_Lumpur]: ")" INPUT_TIMEZONE
    TIMEZONE="${INPUT_TIMEZONE:-Asia/Kuala_Lumpur}"

    # Generate remaining secrets
    JWT_SECRET=$(generate_secret 32)
    DB_ENCRYPTION_SECRET=$(generate_aes_key)

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  Configuration Summary${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  Domain:        ${CYAN}${DOMAIN:-[none - direct IP access]}${NC}"
    echo -e "  Panel User:    ${CYAN}${AUTH_USERNAME}${NC}"
    echo -e "  Panel Pass:    ${CYAN}********${NC}"
    echo -e "  DB Password:   ${CYAN}********${NC}"
    echo -e "  Timezone:      ${CYAN}${TIMEZONE}${NC}"
    echo ""

    read -rp "$(echo -e "${YELLOW}Proceed with installation? [Y/n]:${NC} ")" CONFIRM
    CONFIRM="${CONFIRM:-Y}"
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        log_error "Installation cancelled by user."
        exit 0
    fi
    echo ""
}

# ─── Pre-flight Checks ──────────────────────────────────────────────────────
preflight() {
    log_info "Running pre-flight checks..."

    # Check OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [ "$ID" != "ubuntu" ]; then
            log_warn "This script is designed for Ubuntu. Your OS: $ID. Proceeding anyway..."
        fi
    fi

    # Check available disk space (need at least 20GB for Reforger)
    AVAILABLE_SPACE=$(df / --output=avail -BG | tail -1 | tr -d ' G')
    if [ "$AVAILABLE_SPACE" -lt 20 ]; then
        log_warn "Less than 20GB disk space available ($AVAILABLE_SPACE GB). Arma Reforger needs significant space."
    fi

    # Check RAM (recommend at least 4GB)
    TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$TOTAL_RAM" -lt 3 ]; then
        log_warn "Less than 4GB RAM detected ($TOTAL_RAM GB). Recommend at least 4GB for Arma Reforger."
    fi

    log_success "Pre-flight checks passed"
}

# ─── Install Dependencies ───────────────────────────────────────────────────
install_deps() {
    log_info "Updating system packages..."
    apt-get update -qq
    apt-get upgrade -y -qq

    log_info "Installing required packages..."
    apt-get install -y -qq \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common \
        git \
        ufw \
        openssl \
        xxd

    log_success "System packages installed"
}

# ─── Install Docker ─────────────────────────────────────────────────────────
install_docker() {
    if command -v docker &>/dev/null; then
        log_success "Docker already installed: $(docker --version)"
    else
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl enable docker
        systemctl start docker
        log_success "Docker installed: $(docker --version)"
    fi

    if command -v docker compose &>/dev/null; then
        log_success "Docker Compose already available"
    else
        log_info "Installing Docker Compose plugin..."
        apt-get install -y -qq docker-compose-plugin
        log_success "Docker Compose installed"
    fi
}

# ─── Configure Firewall ─────────────────────────────────────────────────────
configure_firewall() {
    log_info "Configuring firewall (UFW)..."

    ufw --force reset >/dev/null 2>&1
    ufw default deny incoming
    ufw default allow outgoing

    # SSH
    ufw allow 22/tcp comment 'SSH'

    # Centiria GSM Web UI
    ufw allow 8080/tcp comment 'Centiria GSM Web UI'

    # HTTP/HTTPS for Nginx
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'

    # Arma Reforger game ports
    ufw allow 2001/udp comment 'Arma Reforger Game'
    ufw allow 17777/udp comment 'Arma Reforger Steam Query'

    # Common Arma ports (fallback)
    ufw allow 2302:2306/udp comment 'Arma Game Ports'
    ufw allow 27016/udp comment 'Steam Query'

    # Adminer (database management)
    ufw allow 8090/tcp comment 'Adminer DB Admin'

    ufw --force enable
    log_success "Firewall configured"
}

# ─── Setup Project ───────────────────────────────────────────────────────────
setup_project() {
    log_info "Setting up Centiria GSM..."

    # Create directories
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$STORAGE_DIR"
    mkdir -p "$STORAGE_DIR/servers"
    mkdir -p "$STORAGE_DIR/mods"
    mkdir -p "$STORAGE_DIR/logs"

    # Clone or update repo
    if [ -d "$INSTALL_DIR/.git" ]; then
        log_info "Updating existing installation..."
        cd "$INSTALL_DIR"
        git pull --quiet
    else
        log_info "Cloning repository..."
        git clone --quiet "$REPO_URL" "$INSTALL_DIR"
    fi

    cd "$INSTALL_DIR"
    log_success "Project files ready"
}

# ─── Generate .env from user input ──────────────────────────────────────────
generate_env() {
    log_info "Writing configuration..."

    cat > "$INSTALL_DIR/.env" << EOF
# ============================================
# Centiria GSM - Configuration
# Generated on: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
# ============================================

# App version
VERSION=latest

# Storage path for server files, mods, and logs
STORAGE_PATH=${STORAGE_DIR}

# Web UI credentials
AUTH_USERNAME=${AUTH_USERNAME}
AUTH_PASSWORD=${AUTH_PASSWORD}

# Database settings
MYSQL_DB_NAME=centiria_gsm_db
MYSQL_DB_URL=jdbc:mysql://localhost:3306/centiria_gsm_db
MYSQL_USER=centiria_gsm
MYSQL_PASSWORD=${MYSQL_PASSWORD}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}

# JWT secret for authentication tokens
JWT_SECRET=${JWT_SECRET}

# Database encryption secret (AES-256)
DATABASE_ENCRYPTION_SECRET=${DB_ENCRYPTION_SECRET}

# Timezone
TIMEZONE=${TIMEZONE}
EOF

    chmod 600 "$INSTALL_DIR/.env"
    log_success "Configuration written to ${INSTALL_DIR}/.env"
}

# ─── Setup Nginx Reverse Proxy ───────────────────────────────────────────────
setup_nginx() {
    # Skip Nginx if no domain provided
    if [ -z "$DOMAIN" ]; then
        log_info "No domain specified. Skipping Nginx and SSL setup."
        log_info "You can access the panel directly at http://<your-ip>:8080"
        return
    fi

    log_info "Setting up Nginx reverse proxy for ${DOMAIN}..."

    apt-get install -y -qq nginx certbot python3-certbot-nginx

    cat > /etc/nginx/sites-available/centiria-gsm << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 200M;
    }
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/centiria-gsm /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

    # Test and reload
    nginx -t
    systemctl enable nginx
    systemctl restart nginx

    log_success "Nginx configured for ${DOMAIN}"

    # Try to get SSL certificate
    log_info "Attempting SSL certificate from Let's Encrypt..."
    if certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos --email "admin@${DOMAIN}" --redirect 2>/dev/null; then
        log_success "SSL certificate installed successfully"
    else
        log_warn "SSL certificate failed. DNS may not be pointing to this server yet."
        log_warn "Run manually later: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    fi
}

# ─── Create Systemd Service ─────────────────────────────────────────────────
create_service() {
    log_info "Creating systemd service for auto-start..."

    cat > /etc/systemd/system/centiria-gsm.service << EOF
[Unit]
Description=Centiria GSM - Game Server Management
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable centiria-gsm.service

    log_success "Systemd service created (auto-starts on boot)"
}

# ─── Start Services ──────────────────────────────────────────────────────────
start_services() {
    log_info "Starting Centiria GSM services..."
    cd "$INSTALL_DIR"

    docker compose pull
    docker compose up -d

    log_info "Waiting for services to be ready..."
    sleep 10

    # Health check
    if docker compose ps | grep -q "Up"; then
        log_success "Services are running"
    else
        log_warn "Some services may still be starting. Check: docker compose ps"
    fi
}

# ─── Print Summary ───────────────────────────────────────────────────────────
print_summary() {
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║    ${BOLD}Centiria GSM deployed successfully!${NC}${GREEN}                       ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Access URLs:${NC}"
    if [ -n "$DOMAIN" ]; then
        echo -e "  Web UI:    ${CYAN}https://${DOMAIN}${NC}"
    fi
    echo -e "  Direct:    ${CYAN}http://${SERVER_IP}:8080${NC}"
    echo -e "  Adminer:   ${CYAN}http://${SERVER_IP}:8090${NC}"
    echo ""
    echo -e "${BOLD}Login Credentials:${NC}"
    echo -e "  Username:  ${YELLOW}${AUTH_USERNAME}${NC}"
    echo -e "  Password:  ${YELLOW}${AUTH_PASSWORD}${NC}"
    echo ""
    echo -e "${BOLD}Database:${NC}"
    echo -e "  User:      ${YELLOW}centiria_gsm${NC}"
    echo -e "  Password:  ${YELLOW}${MYSQL_PASSWORD}${NC}"
    echo -e "  Root Pass: ${YELLOW}${MYSQL_ROOT_PASSWORD}${NC}"
    echo ""
    echo -e "  1. ${RED}Save these credentials now!${NC} They won't be shown again."
    echo ""
    echo -e "${BOLD}Management Commands:${NC}"
    echo -e "  Start:     ${CYAN}cd ${INSTALL_DIR} && docker compose up -d${NC}"
    echo -e "  Stop:      ${CYAN}cd ${INSTALL_DIR} && docker compose down${NC}"
    echo -e "  Logs:      ${CYAN}cd ${INSTALL_DIR} && docker compose logs -f${NC}"
    echo -e "  Update:    ${CYAN}cd ${INSTALL_DIR} && git pull && docker compose pull && docker compose up -d${NC}"
    echo ""
    echo -e "${BOLD}File Locations:${NC}"
    echo -e "  Config:    ${CYAN}${INSTALL_DIR}/.env${NC}"
    echo -e "  Storage:   ${CYAN}${STORAGE_DIR}${NC}"
    if [ -n "$DOMAIN" ]; then
        echo -e "  Nginx:     ${CYAN}/etc/nginx/sites-available/centiria-gsm${NC}"
    fi
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Save credentials to file
    cat > "$INSTALL_DIR/CREDENTIALS.txt" << CRED
# Centiria GSM - Credentials
# Generated: $(date)
# DELETE THIS FILE AFTER SAVING CREDENTIALS SECURELY

Web UI Username: ${AUTH_USERNAME}
Web UI Password: ${AUTH_PASSWORD}
Database User: centiria_gsm
Database Password: ${MYSQL_PASSWORD}
Database Root Password: ${MYSQL_ROOT_PASSWORD}
JWT Secret: ${JWT_SECRET}
CRED

    if [ -n "$DOMAIN" ]; then
        echo "URL: https://${DOMAIN}" >> "$INSTALL_DIR/CREDENTIALS.txt"
    fi
    echo "Direct: http://${SERVER_IP}:8080" >> "$INSTALL_DIR/CREDENTIALS.txt"

    chmod 600 "$INSTALL_DIR/CREDENTIALS.txt"
    log_info "Credentials saved to: ${INSTALL_DIR}/CREDENTIALS.txt"
    log_warn "Delete this file after saving credentials securely!"
}

# ─── Main ────────────────────────────────────────────────────────────────────
main() {
    banner
    check_root
    collect_user_config
    preflight
    install_deps
    install_docker
    configure_firewall
    setup_project
    generate_env
    setup_nginx
    create_service
    start_services
    print_summary
}

main "$@"
