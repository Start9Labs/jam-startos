import { sdk } from '../sdk'
import { APP_USER, randomPassword } from '../utils'
import { storeJson } from '../fileModels/store.json'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = await storeJson.read((s) => s.APP_PASSWORD).const(effects)
    const desc = 'your Jam password'

    return {
      name: hasPass ? 'Reset Password' : 'Create Password',
      description: hasPass ? `Reset ${desc}` : `Create ${desc}`,
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
      title: 'Success',
      message:
        'Your password has been reset. Use the credentials below to log in.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: APP_USER,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
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
