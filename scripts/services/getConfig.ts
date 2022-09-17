import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "tor-address": {
    "name": "Tor Address",
    "description": "The Tor address of the network interface",
    "type": "pointer",
    "subtype": "package",
    "package-id": "jam",
    "target": "tor-address",
    "interface": "main",
  },
  "lan-address": {
      "name": "Network LAN Address",
      "description": "The LAN address for the network interface.",
      "type": "pointer",
      "subtype": "package",
      "package-id": "jam",
      "target": "lan-address",
      "interface": "main"
  },
  "wallet-rpc-user": {
    "type": "pointer",
    "name": "RPC Username",
    "description": "The username for Bitcoin Core's RPC interface",
    "subtype": "package",
    "package-id": "bitcoind",
    "target": "config",
    "multi": false,
    "selector": "$.rpc.username"
  },
  "wallet-rpc-password": {
    "type": "pointer",
    "name": "RPC Password",
    "description": "The password for Bitcoin Core's RPC interface",
    "subtype": "package",
    "package-id": "bitcoind",
    "target": "config",
    "multi": false,
    "selector": "$.rpc.password"
  },
  "username": {
    "type": "string",
    "name": "JAM Username",
    "description": "Administrator username for JAM",
    "nullable": false,
    "copyable": true,
    "masked": false,
    "default": "embassy"
  },
  "password": {
    "type": "string",
    "name": "JAM Password",
    "description": "Administrator password for JAM",
    "nullable": false,
    "copyable": true,
    "masked": true,
    "default": {
      "charset": "a-z,A-Z,0-9",
      "len": 22
    }
  },
  "bitcoind": {
    "type": "union",
    "name": "Bitcoin Core",
    "description": "The Bitcoin Core node to connect to:\n  - internal: The Bitcoin Core or Proxy services installed to your Embassy\n",
    "tag": {
      "id": "type",
      "name": "Type",
      "variant-names": {
        "internal": "Bitcoin Core",
        "internal-proxy": "Bitcoin Proxy"
      },
      "description": "The Bitcoin Core node to connect to:\n  - internal: The Bitcoin Core and Proxy services installed to your Embassy\n"
    },
    "default": "internal-proxy",
    "variants": {
      "internal": {
        "user": {
          "type": "pointer",
          "name": "RPC Username",
          "description": "The username for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.username"
        },
        "password": {
          "type": "pointer",
          "name": "RPC Password",
          "description": "The password for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.password"
        }
      },
      "internal-proxy": {
        "user": {
          "type": "pointer",
          "name": "RPC Username",
          "description": "The username for the RPC user allocated to JAM",
          "subtype": "package",
          "package-id": "btc-rpc-proxy",
          "target": "config",
          "multi": false,
          "selector": "$.users[?(@.name == \"jam\")].name"
        },
        "password": {
          "type": "pointer",
          "name": "RPC Password",
          "description": "The password for the RPC user allocated to JAM",
          "subtype": "package",
          "package-id": "btc-rpc-proxy",
          "target": "config",
          "multi": false,
          "selector": "$.users[?(@.name == \"jam\")].password"
        },
      }
    }
  },
  "advanced": {
    "type": "object",
    "name": "Advanced",
    "description": "Advanced settings for JAM",
    "spec": {
      "fee-abs": {
        "type": "number",
        "name": "Absolute Fee Limit",
        "description": "Maximum amount in satoshis you will pay for a collaborative transaction.\n",
        "nullable": false,
        "range": "[0,100000000]",
        "integral": true,
        "units": "satoshis",
        "default": 3000000
      },
      "fee-rel": {
        "type": "number",
        "name": "Relative Fee Limit",
        "description": "Maximum percentage of the total you will pay for a collaborative transaction\"\n",
        "nullable": false,
        "range": "[0,1]",
        "integral": false,
        "units": "percent (0 - 1)",
        "default": 0.0003
      }
    }
  }
});
