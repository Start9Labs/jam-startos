import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string } = matches

const shape = object({
  'MESSAGING:onion': object({
    directory_nodes: string.optional().onMismatch(undefined),
  }).optional(),
})

export const joinmarketCfg = FileHelper.ini(
  {
    base: sdk.volumes.jam,
    subpath: './joinmarket.cfg',
  },
  shape,
)
