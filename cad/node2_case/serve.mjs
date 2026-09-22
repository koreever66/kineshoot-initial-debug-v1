import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.stl': 'model/stl',
  '.3mf': 'model/3mf',
  '.png': 'image/png',
  '.css': 'text/css; charset=utf-8',
}

export async function startServer(port = 0) {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, 'http://127.0.0.1')
      let pathname = decodeURIComponent(requestUrl.pathname)
      if (pathname === '/') pathname = '/viewer.html'
      const candidate = resolve(__dirname, `.${normalize(pathname)}`)
      if (!candidate.startsWith(resolve(__dirname))) {
        response.writeHead(403)
        response.end('Forbidden')
        return
      }
      const info = await stat(candidate)
      if (!info.isFile()) throw new Error('not a file')
      const data = await readFile(candidate)
      response.writeHead(200, {
        'Content-Type': mime[extname(candidate).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      response.end(data)
    } catch {
      response.writeHead(404)
      response.end('Not found')
    }
  })

  await new Promise((resolvePromise) => server.listen(port, '127.0.0.1', resolvePromise))
  const address = server.address()
  return {
    server,
    port: address.port,
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolvePromise) => server.close(resolvePromise)),
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const instance = await startServer(Number(process.env.PORT || 4173))
  console.log(`KineShoot Node 2 viewer: ${instance.url}/viewer.html`)
}
