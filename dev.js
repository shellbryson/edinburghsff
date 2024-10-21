import { build, preview } from 'vite';

let previewServer;

build({ build: { watch: {} } }).then((buildWatcher) => {
  buildWatcher.on('event', async ({ code }) => {
    if (code === 'END') {
      previewServer = previewServer || (await preview());

      console.log('\n');
      previewServer.printUrls();
    }
  });
});