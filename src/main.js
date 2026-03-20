// main.js — entry point
//
// 1. Initialise the config form with defaults / query string
// 2. Read config from the form and boot the OTel SDK
// 3. Keep the custom-attributes processor in sync with the form
// 4. Bind all action buttons

import './style.css'
import { readConfigFromForm, parseConfigFromQueryString } from './config.js'
import {
  log, clearLog, setStatus, enableButtons,
  initConfigForm, initCustomAttributes,
  readCustomAttributes, updateSnippet,
} from './ui.js'
import { initOtel } from './otel.js'
import { createActions } from './actions.js'

// ── 1. Config form ────────────────────────────────────────────────────────────

const initialConfig = parseConfigFromQueryString()

// Called whenever any form field or custom attribute changes
function onConfigChange() {
  const config = readConfigFromForm()
  const customAttrs = readCustomAttributes()
  updateSnippet(config, customAttrs)
  if (handle) handle.customAttrsProcessor.update(customAttrs)
}

initConfigForm(initialConfig, onConfigChange)
initCustomAttributes(initialConfig.customAttributes, onConfigChange)

// ── 2. Boot SDK ───────────────────────────────────────────────────────────────

const config = readConfigFromForm()
updateSnippet(config, initialConfig.customAttributes)
setStatus('loading', 'Initialising SDK…')

let handle = null

try {
  handle = initOtel(config)

  setStatus('ok', `SDK ready · ${config.otlpExporterConfig.url}`)
  log('info',  `SDK initialised — service="${config.serviceName}" v${config.serviceVersion}`)
  log('info',  `OTLP endpoint → ${config.otlpExporterConfig.url}`)

  const headerKeys = Object.keys(config.otlpExporterConfig.headers)
  if (headerKeys.length > 0) log('info', `Headers: ${headerKeys.join(', ')}`)

  log('muted', 'Open DevTools → Console to see full span objects')
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err)
  setStatus('error', 'SDK init failed — check console')
  log('error', `SDK init error: ${msg}`)
  console.error('[OTel Demo] SDK init failed:', err)
}

// ── 3. Action buttons ─────────────────────────────────────────────────────────

const noopSpan = {
  setAttribute:    () => noopSpan,
  setAttributes:   () => noopSpan,
  addEvent:        () => noopSpan,
  addLink:         () => noopSpan,
  addLinks:        () => noopSpan,
  setStatus:       () => noopSpan,
  recordException: () => {},
  end:             () => {},
  isRecording:     () => false,
  spanContext:     () => ({ traceId: '0'.repeat(32), spanId: '', traceFlags: 0 }),
}

const noopTracer = {
  startSpan:       () => noopSpan,
  startActiveSpan: (_n, fn) => fn(noopSpan),
}

const actions = createActions(handle?.tracer ?? noopTracer)

function on(id, handler) {
  document.getElementById(id)?.addEventListener('click', () => { void handler() })
}

on('btn-fetch-ok',  actions.fetchOk)
on('btn-fetch-404', actions.fetch404)
on('btn-fetch-net', actions.fetchNetErr)
on('btn-xhr',       actions.xhr)
on('btn-jserr',     actions.jsError)
on('btn-nav',       actions.navigation)
on('btn-custom',    actions.customSpan)
on('btn-nested',    actions.nestedSpans)
on('btn-clear-log', clearLog)

enableButtons()
