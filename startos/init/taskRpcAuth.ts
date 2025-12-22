import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { joinmarketCfg } from '../fileModels/joinmarket.cfg'
import { randomPassword } from '../utils'

export const taskRpcAuth = sdk.setupOnInit(async (effects) => {
  const rpc = await joinmarketCfg
    .read((s) => ({
      user: s.BLOCKCHAIN.rpc_user,
      password: s.BLOCKCHAIN.rpc_password,
    }))
    .const(effects)

  if (!rpc || !rpc.user || !rpc.password) {
    const rpc_user = `jam_${utils.getDefaultString({ charset: 'a-z,A-Z', len: 8 })}`
    const rpc_password = randomPassword()

    await sdk.action.createTask(
      effects,
      'bitcoind',
      generateRpcUserDependent,
      'critical',
      {
        input: {
          kind: 'partial',
          value: {
            username: rpc_user,
            password: rpc_password,
          },
        },
        reason: 'Jam needs an RPC user in Bitcoin',
      },
    )

    await joinmarketCfg.merge(
      effects,
      {
        BLOCKCHAIN: {
          rpc_user,
          rpc_password,
        },
      },
      { allowWriteAfterConst: true },
    )
  }
})
