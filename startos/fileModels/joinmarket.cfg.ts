import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, literal, arrayOf, string } = matches

const {
  blockchain: { rpc_cookie_file, rpc_port, rpc_wallet_file, rpc_host },
} = configDefaults

const shape = object({
  blockchain: object({
    rpc_cookie_file: literal(rpc_cookie_file).onMismatch(rpc_cookie_file),
    rpc_port: literal(rpc_port).onMismatch(rpc_port),
    rpc_wallet_file: literal(rpc_wallet_file).onMismatch(rpc_wallet_file),
    rpc_host: literal(rpc_host).onMismatch(rpc_host),
  }),
  'messaging:onion': object({
    socks5_host: string,
    directory_nodes: arrayOf(string),
  }).optional(),
  'messaging:hackint': object({
    socks5_host: string,
  }).optional(),
})

export const joinmarketCfg = FileHelper.ini(
  {
    volumeId: 'main',
    subpath: '/.joinmarket/joinmarket.cfg',
  },
  shape,
)
