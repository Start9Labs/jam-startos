import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const arch =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'jam',
  title: 'Jam',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/jam-startos',
  upstreamRepo: 'https://github.com/joinmarket-webui/jam-docker',
  supportSite: 'https://github.com/joinmarket-webui/jam/issues',
  marketingSite: 'https://jamapp.org',
  donationUrl: null,
  docsUrl: 'https://github.com/Start9Labs/jam-startos/docs/instructions.md',
  description: {
    short: 'A web user interface for JoinMarket.',
    long: 'Jam is a web interface for JoinMarket focusing on user-friendliness and ease-of-use. It aims to provide sensible defaults and be easy to use for beginners while still having the features advanced users expect.',
  },
  volumes: ['main'],
  images: {
    jam: {
      source: {
        dockerTag:
          'ghcr.io/joinmarket-webui/jam-standalone:v0.3.0-clientserver-v0.9.11',
      },
      arch,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description:
        'Used to subscribe to new block events from a full archival node',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.3-alpha.8/bitcoind.s9pk',
    },
  },
})
