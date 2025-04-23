import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = await sdk.store
      .getOwn(effects, sdk.StorePath.password)
      .const()
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
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    await sdk.store.setOwn(effects, sdk.StorePath.password, password)

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
            value: await sdk.store
              .getOwn(effects, sdk.StorePath.username)
              .once(),
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
