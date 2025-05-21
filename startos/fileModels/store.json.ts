import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string } = matches

const shape = object({
  password: string.onMismatch(''),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
