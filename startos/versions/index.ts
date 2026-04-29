import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_4_1_8 } from './v0.4.1.8'
import { v_0_4_1_9 } from './v0.4.1.9'

export const versionGraph = VersionGraph.of({
  current: v_0_4_1_9,
  other: [v_0_4_1_8],
})
