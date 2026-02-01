import { sdk } from '../sdk'
import { APP_USER, randomPassword } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = await storeJson.read((s) => s.APP_PASSWORD).const(effects)

    return {
      name: hasPass ? i18n('Reset Password') : i18n('Create Password'),
      description: hasPass ? i18n('Reset your Jam password') : i18n('Create your Jam password'),
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const APP_PASSWORD = randomPassword()

    await storeJson.merge(effects, { APP_PASSWORD })

    return {
      version: '1',
      title: i18n('Success'),
      message:
        i18n('Your password has been reset. Use the credentials below to log in.'),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: APP_USER,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: APP_PASSWORD,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
