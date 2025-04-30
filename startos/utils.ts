export const uiPort = 80

export const APP_USER = 'jam'

export const configDefaults = {
  blockchain: {
    rpc_cookie_file: '.bitcoin/.cookie',
    rpc_port: '8332',
    rpc_wallet_file: 'embassy_jam_wallet',
    rpc_host: 'bitcoind.startos',
  },
} as const
