// config.js — SDK config defaults, QS parser, and form reader
//
// Query string parameters:
//   serviceName    → sdkConfig.serviceName
//   serviceVersion → sdkConfig.serviceVersion
//   otlpUrl        → sdkConfig.otlpExporterConfig.url
//   headers        → sdkConfig.otlpExporterConfig.headers  (URL-encoded JSON)
//   attrs          → sdkConfig.customAttributes             (URL-encoded JSON)

export const DEFAULTS = {
  serviceName:    'browser-demo',
  serviceVersion: '1.0.0',
  otlpUrl: 'http://localhost:4318/v1/traces',
}

function parseJson(raw, fallback) {
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed
    }
  } catch { /* ignore */ }
  return fallback
}

/** Load config from the page URL query string. Falls back to defaults. */
export function parseConfigFromQueryString() {
  const qs = new URLSearchParams(location.search)
  return {
    serviceName:      qs.get('serviceName')    ?? DEFAULTS.serviceName,
    serviceVersion:   qs.get('serviceVersion') ?? DEFAULTS.serviceVersion,
    otlpExporterConfig: {
      url: qs.get('otlpUrl') ?? DEFAULTS.otlpUrl,
    },
    customAttributes: parseJson(qs.get('attrs'), {}),
  }
}

/** Read current config from the form fields (used at SDK init time). */
function field(id) {
  return document.getElementById(id)?.value.trim() ?? ''
}

export function readConfigFromForm() {
  return {
    serviceName:    field('ub-sn')  || DEFAULTS.serviceName,
    serviceVersion: field('ub-sv')  || DEFAULTS.serviceVersion,
    otlpExporterConfig: {
      url: field('ub-url') || DEFAULTS.otlpUrl,
    },
    customAttributes: {},  // populated separately via readCustomAttributes()
  }
}
