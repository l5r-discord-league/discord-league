import 'source-map-support/register'

import createApp from './app'

createApp().then(({ run }) => run())
