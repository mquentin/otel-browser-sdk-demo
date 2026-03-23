// otel.js — SDK initialisation: traces + logs

import { trace } from '@opentelemetry/api'
import { logs } from '@opentelemetry/api-logs'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { ExportResultCode } from '@opentelemetry/core'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { Resource } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'

import { log } from './ui.js'

// ── UISpanExporter ────────────────────────────────────────────────────────────

class UISpanExporter {
  export(spans, resultCallback) {
    for (const span of spans) {
      const [secs, nanos] = span.duration
      const durationMs = (secs * 1_000 + nanos / 1_000_000).toFixed(1)
      const isError = span.status.code === 2
      const icon    = isError ? '🔴' : '🟢'
      const traceId = span.spanContext().traceId.slice(0, 16) + '…'
      log('span', `${icon} [span] ${span.name} · ${durationMs}ms · trace=${traceId}`)
    }
    resultCallback({ code: ExportResultCode.SUCCESS })
  }
  shutdown() { return Promise.resolve() }
}

// ── UILogExporter ─────────────────────────────────────────────────────────────

class UILogExporter {
  export(logRecords, resultCallback) {
    for (const record of logRecords) {
      const sev = record.severityText ?? 'INFO'
      const body = typeof record.body === 'string'
        ? record.body
        : JSON.stringify(record.body)
      log('muted', `📋 [log] ${sev} · ${body}`)
    }
    resultCallback({ code: ExportResultCode.SUCCESS })
  }
  shutdown() { return Promise.resolve() }
}

// ── initOtel ──────────────────────────────────────────────────────────────────
// tracesUrl and logsUrl are used as-is — no path is appended.
// customAttrs are merged into the Resource so they appear in resource.attributes
// on every span and log record.

export function initOtel(config, customAttrs = {}) {
  // Custom attributes become resource attributes shared by all signals.
  const resource = new Resource({
    [ATTR_SERVICE_NAME]:    config.serviceName,
    [ATTR_SERVICE_VERSION]: config.serviceVersion,
    ...customAttrs,
  })

  // ── Traces ──────────────────────────────────────────────────────────────────
  const traceExporter = new OTLPTraceExporter({ url: config.tracesUrl, headers: {} })
  const traceProvider = new WebTracerProvider({ resource })

  traceProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter, {
    maxExportBatchSize:    10,
    scheduledDelayMillis: 1_000,
  }))
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(new UISpanExporter()))
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
  traceProvider.register()

  // ── Logs ────────────────────────────────────────────────────────────────────
  const logExporter  = new OTLPLogExporter({ url: config.logsUrl, headers: {} })
  const logProvider  = new LoggerProvider({ resource })

  logProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter, {
    maxExportBatchSize:    10,
    scheduledDelayMillis: 1_000,
  }))
  logProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new UILogExporter()))
  logProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()))
  logs.setGlobalLoggerProvider(logProvider)

  // ── Auto-instrumentations ───────────────────────────────────────────────────
  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/.*/],
        clearTimingResources: true,
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [/.*/],
      }),
    ],
  })

  return {
    tracer: trace.getTracer(config.serviceName, config.serviceVersion),
    logger: logs.getLogger(config.serviceName, config.serviceVersion),
  }
}
