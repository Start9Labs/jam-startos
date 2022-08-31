#!/bin/bash

set -e

_term() { 
  echo "Caught SIGTERM signal!"
  kill -TERM "$jm_child" 2>/dev/null
  exit 0
}

# Setting env-vars
echo "Setting environment variables..."
export APP_USER=$(yq e '.username' /root/start9/config.yaml)
export APP_PASSWORD=$(yq e '.password' /root/start9/config.yaml)
export TOR_HOST=$(yq e '.tor-address' /root/start9/config.yaml)
export LAN_HOST=$(yq e '.lan-address' /root/start9/config.yaml)
export RPC_TYPE=$(yq e '.bitcoind.type' /root/start9/config.yaml)
export JM_RPC_USER=$(yq e '.bitcoind.user' /root/start9/config.yaml)
export JM_RPC_PASSWORD=$(yq e '.bitcoind.password' /root/start9/config.yaml)
export RPC_PORT=8332
export JM_WALLET=$(yq e '.jm-wallet' /root/start9/config.yaml)
export JM_HOST="jam.embassy"
if [ "$RPC_TYPE" = "internal-proxy" ]; then
	export JM_RPC_HOST="btc-rpc-proxy.embassy"
	echo "Running on Bitcoin Proxy..."
else
	export JM_RPC_HOST="bitcoind.embassy"
	echo "Running on Bitcoin Core..."
fi

# Configuring Webserver
echo "Configuring JoinMarket..."
sed -i "s/\[supervisord\].*/\[supervisord\]\nuser=root/" /etc/supervisor/supervisord.conf
echo '' >> /etc/supervisor/supervisord.conf && echo '[inet_http_server]' >> /etc/supervisor/supervisord.conf && echo 'port = *:8080' >> /etc/supervisor/supervisord.conf
if ! [ -f "/root/.joinmarket/joinmarket.cfg" ]; then
	echo "Creating JM configuration file..."
	cd /src/scripts/
	python jmwalletd.py
fi
sed -i "s/rpc_host =.*/rpc_host = $RPC_HOST/" /root/.joinmarket/joinmarket.cfg
sed -i "s/rpc_password =.*/rpc_password = $JM_RPC_PASSWORD/" /root/.joinmarket/joinmarket.cfg
sed -i "s/rpc_user =.*/rpc_user = $JM_RPC_USER/" /root/.joinmarket/joinmarket.cfg
sed -i "s/rpc_port =.*/rpc_port = $RPC_PORT/" /root/.joinmarket/joinmarket.cfg
sed -i "s/rpc_wallet_file =.*/rpc_wallet_file = $JM_WALLET/" /root/.joinmarket/joinmarket.cfg
sed -i "s/localhost/$JM_HOST/" /root/.joinmarket/joinmarket.cfg
sed -i "s/'jm_webui_default'/$JM_WALLET/g" /jam-entrypoint.sh
sed -i "s/exec supervisord.*/exec supervisord -c \/etc\/supervisor\/supervisord\.conf/" /jam-entrypoint.sh 

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

export count=`find /root/.joinmarket/wallets -type f -iname ".*.jmdat.lock" | wc -l`
if [ $count != 0 ]
then
	echo "Unlocking JAM Wallet(s)..." 
	rm -rf /root/.joinmarket/wallets/.*.jmdat.lock
fi 

# Starting JoinMarket API
echo "Starting JoinMarket..."
cd /src/scripts/
/jam-entrypoint.sh

trap _term SIGTERM
wait $jm_child