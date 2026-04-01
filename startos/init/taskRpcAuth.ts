import { sdk } from '../sdk'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { randomPassword } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'

export const taskRpcAuth = sdk.setupOnInit(async (effects) => {
  const store = await storeJson
    .read((s) => ({
      jamInstanceId: s.jamInstanceId,
      password: s.JM_RPC_PASSWORD,
    }))
    .const(effects)

  if (!store?.password) {
    const JM_RPC_PASSWORD = randomPassword()

    await sdk.action.createTask(
      effects,
      'bitcoind',
      generateRpcUserDependent,
      'critical',
      {
        input: {
          kind: 'partial',
          value: {
            username: store?.jamInstanceId,
            password: JM_RPC_PASSWORD,
          },
        },
        reason: i18n('Jam needs an RPC user in Bitcoin'),
      },
    )

    await storeJson.merge(
      effects,
      {
        JM_RPC_PASSWORD,
      },
      { allowWriteAfterConst: true },
    )
  }
})
