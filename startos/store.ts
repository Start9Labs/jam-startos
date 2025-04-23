import { setupExposeStore } from '@start9labs/start-sdk'

export type Store = {
  username: string
  password: string
}

export const initStore: Store = {
  username: 'jam',
  password: '',
}

export const exposedStore = setupExposeStore<Store>(() => [])
