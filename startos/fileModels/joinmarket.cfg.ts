import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, literal, string } = matches

const {
  BLOCKCHAIN: { rpc_port, rpc_wallet_file, rpc_host },
} = configDefaults

const shape = object({
  BLOCKCHAIN: object({
    rpc_port: literal(rpc_port).onMismatch(rpc_port),
    rpc_wallet_file: literal(rpc_wallet_file).onMismatch(rpc_wallet_file),
    rpc_host: literal(rpc_host).onMismatch(rpc_host),
    rpc_user: string.optional().onMismatch(undefined),
    rpc_password: string.optional().onMismatch(undefined),
  }),
  'MESSAGING:onion': object({
    socks5_host: string,
  }).optional(),
  'MESSAGING:hackint': object({
    socks5_host: string,
  }).optional(),
})

export const joinmarketCfg = FileHelper.ini(
  {
    volumeId: 'jam',
    subpath: './joinmarket.cfg',
  },
  shape,
)
