import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string } = matches

const shape = object({
  password: string.onMismatch(''),
})

export const store = FileHelper.json(
  { volumeId: 'jam', subpath: '/store.json' },
  shape,
)
