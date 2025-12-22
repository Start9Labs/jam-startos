import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string } = matches

const shape = object({
  'MESSAGING:onion': object({
    directory_nodes: string.optional().onMismatch(undefined),
  }).optional(),
})

export const joinmarketCfg = FileHelper.ini(
  {
    volumeId: 'jam',
    subpath: './joinmarket.cfg',
  },
  shape,
)
