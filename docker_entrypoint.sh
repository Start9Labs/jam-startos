#!/bin/bash

set -e

# Setting env-vars
echo "Setting environment variables..."
export APP_USER=$(yq e '.username' /data/start9/config.yaml)
export APP_PASSWORD=$(yq e '.password' /data/start9/config.yaml)
export TOR_HOST=$(yq e '.tor-address' /data/start9/config.yaml)
export LAN_HOST=$(yq e '.lan-address' /data/start9/config.yaml)
export JM_RPC_USER=$(yq e '.bitcoind-user' /data/start9/config.yaml)
export JM_RPC_PASSWORD=$(yq e '.bitcoind-password' /data/start9/config.yaml)
export JM_RPC_PORT=8332
export JM_RPC_WALLET_FILE="embassy_jam_wallet"
export JM_RPC_HOST="bitcoind.embassy"
echo "Running on Bitcoin Core..."

# Properties Page showing password to be used for login
  echo 'version: 2' > /data/start9/stats.yaml
  echo 'data:' >> /data/start9/stats.yaml
  echo '  Username: ' >> /data/start9/stats.yaml
        echo '    type: string' >> /data/start9/stats.yaml
        echo "    value: \"$APP_USER\"" >> /data/start9/stats.yaml
        echo '    description: This is your username for JAM' >> /data/start9/stats.yaml
        echo '    copyable: true' >> /data/start9/stats.yaml
        echo '    masked: false' >> /data/start9/stats.yaml
        echo '    qr: false' >> /data/start9/stats.yaml
  echo '  Password: ' >> /data/start9/stats.yaml
        echo '    type: string' >> /data/start9/stats.yaml
        echo "    value: \"$APP_PASSWORD\"" >> /data/start9/stats.yaml
        echo '    description: This is your password for JAM. Please use caution when sharing this password, you could lose your funds!' >> /data/start9/stats.yaml
        echo '    copyable: true' >> /data/start9/stats.yaml
        echo '    masked: true' >> /data/start9/stats.yaml
        echo '    qr: false' >> /data/start9/stats.yaml

# Starting JoinMarket API
echo "Starting JoinMarket..."

/jam-entrypoint.sh &
tail -F /var/log/jam/obwatch_stdout.log /var/log/jam/jmwallet_stdout.log /var/log/jam/tor_stdout.log