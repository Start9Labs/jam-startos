import { resetPassword } from '../actions/resetPassword'
import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const taskSetPassword = sdk.setupOnInit(async (effects) => {
  if (!(await store.read((s) => s.password).const(effects))) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Create you Jam password',
    })
  }
})
