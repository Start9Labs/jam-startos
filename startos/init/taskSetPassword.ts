import { resetPassword } from '../actions/resetPassword'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

export const taskSetPassword = sdk.setupOnInit(async (effects) => {
  if (!(await storeJson.read((s) => s.APP_PASSWORD).const(effects))) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: i18n('Create your Jam password'),
    })
  }
})
