import { resetPassword } from '../actions/resetPassword'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const taskSetPassword = sdk.setupOnInit(async (effects) => {
  if (!(await storeJson.read((s) => s.password).const(effects))) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Create your Jam password',
    })
  }
})
