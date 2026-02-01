import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

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
  description: i18n.description,
  volumes: ['main', 'jam'],
  images: {
    jam: {
      source: {
        dockerTag:
          'ghcr.io/joinmarket-webui/jam-standalone:v0.4.1-clientserver-v0.9.11',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to subscribe to new block events.',
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
