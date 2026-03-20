// scripts/build.mjs — production build
// Usage: npm run build

import * as esbuild from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

mkdirSync('dist', { recursive: true })

const result = await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outdir: 'dist',
  entryNames: 'bundle',
  minify: true,
  target: 'es2020',
  sourcemap: false,
  metafile: true,
  logLevel: 'info',
})

// Copy index.html to dist/ and rewrite asset paths for standalone deployment
const html = readFileSync('index.html', 'utf8')
  .replace('dist/bundle.css', './bundle.css')
  .replace('dist/bundle.js',  './bundle.js')
writeFileSync('dist/index.html', html)

// Print bundle sizes
for (const [file, meta] of Object.entries(result.metafile.outputs)) {
  const kb = (meta.bytes / 1024).toFixed(1)
  console.log(`  ${file.padEnd(28)} ${kb} kB`)
}

console.log('\n  Build complete → dist/')
