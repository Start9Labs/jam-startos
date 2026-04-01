import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  APP_PASSWORD: z.string().optional(),
  JM_RPC_PASSWORD: z.string().optional(),
  jamInstanceId: z.string(),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
