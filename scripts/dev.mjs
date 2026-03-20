// scripts/dev.mjs — esbuild dev server with watch + live rebuild
// Usage: npm run dev

import * as esbuild from 'esbuild'

const ctx = await esbuild.context({
  entryPoints: ['src/main.js'],
  bundle: true,
  outdir: 'dist',
  entryNames: 'bundle',
  sourcemap: true,
  target: 'es2020',
  logLevel: 'info',
})

// Watch for file changes and rebuild automatically
await ctx.watch()

// Serve the project root; esbuild handles /dist/bundle.js + /dist/bundle.css
const { port } = await ctx.serve({
  servedir: '.',
  port: 3000,
  fallback: 'index.html',
})

console.log(`\n  Dev server → http://localhost:${port}\n`)
