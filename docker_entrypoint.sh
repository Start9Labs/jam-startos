#!/bin/bash

set -e

# Setting env-vars
echo "Setting environment variables..."
export APP_USER=$(yq e '.username' /embassy/start9/config.yaml)
export APP_PASSWORD=$(yq e '.password' /embassy/start9/config.yaml)
export TOR_HOST=$(yq e '.tor-address' /embassy/start9/config.yaml)
export LAN_HOST=$(yq e '.lan-address' /embassy/start9/config.yaml)
export JM_RPC_USER=$(yq e '.bitcoind-user' /embassy/start9/config.yaml)
export JM_RPC_PASSWORD=$(yq e '.bitcoind-password' /embassy/start9/config.yaml)
export JM_RPC_PORT=8332
export JM_RPC_WALLET_FILE="embassy_jam_wallet"
export JM_RPC_HOST="bitcoind.embassy"
echo "Running on Bitcoin Core..."

# Properties Page showing password to be used for login
echo 'version: 2' > /embassy/start9/stats.yaml
echo 'data:' >> /embassy/start9/stats.yaml
echo '  Username: ' >> /embassy/start9/stats.yaml
echo '    type: string' >> /embassy/start9/stats.yaml
echo "    value: \"$APP_USER\"" >> /embassy/start9/stats.yaml
echo '    description: This is your username for JAM' >> /embassy/start9/stats.yaml
echo '    copyable: true' >> /embassy/start9/stats.yaml
echo '    masked: false' >> /embassy/start9/stats.yaml
echo '    qr: false' >> /embassy/start9/stats.yaml
echo '  Password: ' >> /embassy/start9/stats.yaml
echo '    type: string' >> /embassy/start9/stats.yaml
echo "    value: \"$APP_PASSWORD\"" >> /embassy/start9/stats.yaml
echo '    description: This is your password for JAM. Please use caution when sharing this password, you could lose your funds!' >> /embassy/start9/stats.yaml
echo '    copyable: true' >> /embassy/start9/stats.yaml
echo '    masked: true' >> /embassy/start9/stats.yaml
echo '    qr: false' >> /embassy/start9/stats.yaml

# Starting JoinMarket API
echo "Starting JoinMarket..."
exec /jam-entrypoint.sh 
