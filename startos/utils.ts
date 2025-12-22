import { utils } from '@start9labs/start-sdk'

export const uiPort = 80

export const APP_USER = 'jam'

export const configDefaults = {
  BLOCKCHAIN: {
    rpc_port: '8332',
    rpc_wallet_file: 'embassy_jam_wallet',
    rpc_host: 'bitcoind.startos',
  },
} as const

export function randomPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9',
    len: 32,
  })
}
