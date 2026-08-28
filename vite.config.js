import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom robust file downloader middleware plugin
const downloadsMiddlewarePlugin = () => ({
  name: 'downloads-middleware-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (url.startsWith('/downloads/')) {
        const cleanFileName = decodeURIComponent(url.replace('/downloads/', '').split('?')[0]);
        const filePath = path.join(process.cwd(), 'public', 'downloads', cleanFileName);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const stat = fs.statSync(filePath);
          const range = req.headers.range;

          res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}"`);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'no-cache');

          // Determine MIME type
          if (cleanFileName.endsWith('.exe')) res.setHeader('Content-Type', 'application/vnd.microsoft.portable-executable');
          else if (cleanFileName.endsWith('.apk')) res.setHeader('Content-Type', 'application/vnd.android.package-archive');
          else if (cleanFileName.endsWith('.dmg')) res.setHeader('Content-Type', 'application/x-apple-diskimage');
          else if (cleanFileName.endsWith('.AppImage')) res.setHeader('Content-Type', 'application/x-executable');
          else if (cleanFileName.endsWith('.mobileconfig')) res.setHeader('Content-Type', 'application/x-apple-aspen-config');
          else res.setHeader('Content-Type', 'application/octet-stream');

          if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunksize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Content-Length': chunksize,
            });
            fileStream.pipe(res);
            return;
          } else {
            res.setHeader('Content-Length', stat.size);
            res.writeHead(200);
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), downloadsMiddlewarePlugin()],
  build: {
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/public/downloads/**', '**/dist/**', '**/*.TMP']
    },
    proxy: {
      '/api/replicate': {
        target: 'https://api.replicate.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
        headers: {
          'Origin': 'https://api.replicate.com'
        }
      }
    }
  }
})
