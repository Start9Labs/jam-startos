import { setupExposeStore } from '@start9labs/start-sdk'

export type Store = {
  password: string
}

export const initStore: Store = {
  password: '',
}

export const exposedStore = setupExposeStore<Store>(() => [])
