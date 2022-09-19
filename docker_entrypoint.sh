#!/bin/bash

set -e

_term() { 
  echo "Caught SIGTERM signal!"
  kill -TERM "$jm_child" 2>/dev/null
  exit 0
}

# Setting env-vars
mkdir -p /root/.joinmarket
echo "Setting environment variables..."
export APP_USER=$(yq e '.username' /root/start9/config.yaml)
export APP_PASSWORD=$(yq e '.password' /root/start9/config.yaml)
export TOR_HOST=$(yq e '.tor-address' /root/start9/config.yaml)
export LAN_HOST=$(yq e '.lan-address' /root/start9/config.yaml)
export RPC_TYPE=$(yq e '.bitcoind.type' /root/start9/config.yaml)
export JM_RPC_USER=$(yq e '.bitcoind.user' /root/start9/config.yaml)
export JM_RPC_PASSWORD=$(yq e '.bitcoind.password' /root/start9/config.yaml)
export JM_RPC_PORT=8332
export JM_WALLET="embassy_jam_wallet"
export JM_HOST="jam.embassy"
export JM_WALLET_RPC_USER=$(yq e '.wallet-rpc-user' /root/start9/config.yaml)
export JM_WALLET_RPC_PASSWORD=$(yq e '.wallet-rpc-password' /root/start9/config.yaml)
export JM_WALLET_RPC_HOST="bitcoind.embassy"
export MAX_CJ_FEE_ABS=$(yq e '.advanced.fee-abs' /root/start9/config.yaml)
export MAX_CJ_FEE_REL=$(yq e '.advanced.fee-rel' /root/start9/config.yaml)
if [ "$RPC_TYPE" = "internal-proxy" ]; then
	export JM_RPC_HOST="btc-rpc-proxy.embassy"
	echo "Running on Bitcoin Proxy..."
else
	export JM_RPC_HOST="bitcoind.embassy"
	echo "Running on Bitcoin Core..."
fi

if ! [ -f "/root/.joinmarket/joinmarket.cfg" ]; then
  # Create Core Wallet using the Bitcoin Core Credentials. Trying to create a non descriptor wallet using the proxy credentials results in an error
  echo "Creating Default Wallet..."
  curl -sS --user $JM_WALLET_RPC_USER:$JM_WALLET_RPC_PASSWORD --data-binary '{"jsonrpc": "1.0", "id": "wallet-gen", "method": "createwallet", "params": {"wallet_name":"'$JM_WALLET'","descriptors":false}}' -H 'content-type: text/plain;' http://$JM_WALLET_RPC_HOST:8332/
fi

# # Configuring Webserver
echo "Configuring JoinMarket..."
sed -i "s/rpc_host =.*/rpc_host = $JM_RPC_HOST/" /default.cfg
sed -i "s/rpc_user =.*/rpc_user = $JM_RPC_USER/" /default.cfg
sed -i "s/rpc_port =.*/rpc_port = $JM_RPC_PORT/" /default.cfg
sed -i "s/rpc_password =.*/rpc_password = $JM_RPC_PASSWORD/" /default.cfg
sed -i "s/rpc_wallet_file =.*/rpc_wallet_file = $JM_WALLET/" /default.cfg
sed -i "s/max_cj_fee_abs =.*/max_cj_fee_abs = $MAX_CJ_FEE_ABS/" /default.cfg
sed -i "s/max_cj_fee_rel =.*/max_cj_fee_rel = $MAX_CJ_FEE_REL/" /default.cfg
sed -i "s/exec supervisord.*/exec supervisord -c \/etc\/supervisor\/supervisord\.conf/" /jam-entrypoint.sh
sed -i "s/jm_webui_default/$JM_WALLET/" /jam-entrypoint.sh

# Properties Page showing password to be used for login
  echo 'version: 2' > /root/start9/stats.yaml
  echo 'data:' >> /root/start9/stats.yaml
  echo '  Username: ' >> /root/start9/stats.yaml
        echo '    type: string' >> /root/start9/stats.yaml
        echo "    value: \"$APP_USER\"" >> /root/start9/stats.yaml
        echo '    description: This is your username for JAM' >> /root/start9/stats.yaml
        echo '    copyable: true' >> /root/start9/stats.yaml
        echo '    masked: false' >> /root/start9/stats.yaml
        echo '    qr: false' >> /root/start9/stats.yaml
  echo '  Password: ' >> /root/start9/stats.yaml
        echo '    type: string' >> /root/start9/stats.yaml
        echo "    value: \"$APP_PASSWORD\"" >> /root/start9/stats.yaml
        echo '    description: This is your password for JAM. Please use caution when sharing this password, you could lose your funds!' >> /root/start9/stats.yaml
        echo '    copyable: true' >> /root/start9/stats.yaml
        echo '    masked: true' >> /root/start9/stats.yaml
        echo '    qr: false' >> /root/start9/stats.yaml
  echo '  Maximum Absolute CoinJoin Fee in Satoshis: ' >> /root/start9/stats.yaml
        echo '    type: string' >> /root/start9/stats.yaml
        echo "    value: \"$MAX_CJ_FEE_ABS\"" >> /root/start9/stats.yaml
        echo '    description: Maximum absolute coinjoin fee in satoshi to pay to a single market maker for a transaction' >> /root/start9/stats.yaml
        echo '    copyable: false' >> /root/start9/stats.yaml
        echo '    masked: false' >> /root/start9/stats.yaml
        echo '    qr: false' >> /root/start9/stats.yaml
  echo '  Maximum Relative CoinJoin Fee Rate: ' >> /root/start9/stats.yaml
        echo '    type: string' >> /root/start9/stats.yaml
        echo "    value: \"$MAX_CJ_FEE_REL\"" >> /root/start9/stats.yaml
        echo '    description: Maximum relative coinjoin fee, in fractions of the coinjoin value' >> /root/start9/stats.yaml
        echo '    copyable: false' >> /root/start9/stats.yaml
        echo '    masked: false' >> /root/start9/stats.yaml
        echo '    qr: false' >> /root/start9/stats.yaml

# Starting JoinMarket API
echo "Starting JoinMarket..."
cd /src/scripts/
/jam-entrypoint.sh

trap _term SIGTERM
wait $jm_child
