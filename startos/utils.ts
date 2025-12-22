import { utils } from '@start9labs/start-sdk'

export const uiPort = 80

export const APP_USER = 'jam'

export function randomPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9',
    len: 32,
  })
}
