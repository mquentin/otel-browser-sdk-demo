// main.js — entry point
//
// 1. Initialise the config form with defaults / query string
// 2. Read config + custom attrs from the form and boot the OTel SDK
//    Custom attrs are resource attributes — they go into Resource, not onto
//    individual spans/logs.
// 3. When config/attrs change, show a "Reinit SDK" button.
//    Clicking it reloads the page; the URL QS carries the new config so the
//    SDK boots fresh with the updated resource.
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

// Called whenever any form field or custom attribute changes.
// We don't hot-reinit the SDK because custom attrs live in the Resource which
// is immutable — instead we surface a "Reinit SDK" button.
function onConfigChange() {
  const config = readConfigFromForm()
  const customAttrs = readCustomAttributes()
  updateSnippet(config, customAttrs)
  showReinitBanner()
}

initConfigForm(initialConfig, onConfigChange)
initCustomAttributes(initialConfig.customAttributes, onConfigChange)

// ── 2. Boot SDK ───────────────────────────────────────────────────────────────

const config      = readConfigFromForm()
const customAttrs = readCustomAttributes()
updateSnippet(config, customAttrs)
setStatus('loading', 'Initialising SDK…')

let handle = null

try {
  handle = initOtel(config, customAttrs)

  setStatus('ok', `SDK ready · ${config.tracesUrl}`)
  log('info',  `SDK initialised — service="${config.serviceName}" v${config.serviceVersion}`)
  log('info',  `Traces → ${config.tracesUrl}`)
  log('info',  `Logs   → ${config.logsUrl}`)
  if (Object.keys(customAttrs).length) {
    log('info', `Resource attrs → ${JSON.stringify(customAttrs)}`)
  }
  log('muted', 'Open DevTools → Console to see full span/log objects')
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err)
  setStatus('error', 'SDK init failed — check console')
  log('error', `SDK init error: ${msg}`)
  console.error('[OTel Demo] SDK init failed:', err)
}

// ── 3. Reinit banner ──────────────────────────────────────────────────────────

function showReinitBanner() {
  let banner = document.getElementById('reinit-banner')
  if (banner) return   // already visible
  banner = document.createElement('div')
  banner.id = 'reinit-banner'
  banner.className = 'reinit-banner'
  banner.innerHTML =
    '⚠️ Resource attributes are set at SDK init — ' +
    '<button id="btn-reinit">Reinit SDK</button> to apply changes'
  // Insert banner after the custom-attrs section
  const attrsSection = document.querySelector('.attrs-section')
  attrsSection?.after(banner)
  document.getElementById('btn-reinit').addEventListener('click', () => {
    window.location.reload()
  })
}

// ── 4. Action buttons ─────────────────────────────────────────────────────────

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

const noopLogger = {
  emit: () => {},
}

const actions = createActions(handle?.tracer ?? noopTracer, handle?.logger ?? noopLogger)

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
on('btn-log-info',  actions.logInfo)
on('btn-log-warn',  actions.logWarn)
on('btn-log-error', actions.logError)
on('btn-clear-log', clearLog)

enableButtons()
