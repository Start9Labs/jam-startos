import { sdk } from '../sdk'
import { seedFiles } from './seedFiles'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { taskSetPassword } from './taskSetPassword'
import { taskRpcAuth } from './taskRpcAuth'

export const init = sdk.setupInit(
  seedFiles,
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  taskSetPassword,
  taskRpcAuth,
)

export const uninit = sdk.setupUninit(versionGraph)
