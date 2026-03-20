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

// ── URL helpers ───────────────────────────────────────────────────────────────

function signalUrl(base, signal) {
  return base.replace(/\/$/, '') + '/v1/' + signal
}

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

// ── Custom attributes ─────────────────────────────────────────────────────────
// Attrs are stored on the processor instance. The log processor closes over
// the same instance inside initOtel so both signals share one source of truth.

export class CustomAttributesProcessor {
  attrs = {}

  update(attrs) { this.attrs = { ...attrs } }

  // SpanProcessor interface
  onStart(span) {
    for (const [k, v] of Object.entries(this.attrs)) span.setAttribute(k, v)
  }
  onEnd() {}
  shutdown()   { return Promise.resolve() }
  forceFlush() { return Promise.resolve() }
}

// ── initOtel ──────────────────────────────────────────────────────────────────

export function initOtel(config) {
  const baseUrl  = config.otlpExporterConfig.url
  const resource = new Resource({
    [ATTR_SERVICE_NAME]:    config.serviceName,
    [ATTR_SERVICE_VERSION]: config.serviceVersion,
  })

  const customAttrsProcessor = new CustomAttributesProcessor()

  // ── Traces ──────────────────────────────────────────────────────────────────
  const traceExporter = new OTLPTraceExporter({ url: signalUrl(baseUrl, 'traces') })
  const traceProvider = new WebTracerProvider({ resource })

  // CustomAttributesProcessor first so attrs are on the span before any exporter.
  traceProvider.addSpanProcessor(customAttrsProcessor)
  traceProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter, {
    maxExportBatchSize:    10,
    scheduledDelayMillis: 1_000,
  }))
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(new UISpanExporter()))
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
  traceProvider.register()

  // ── Logs ────────────────────────────────────────────────────────────────────
  const logExporter  = new OTLPLogExporter({ url: signalUrl(baseUrl, 'logs') })
  const logProvider  = new LoggerProvider({ resource })

  // Inline log processor closes over customAttrsProcessor — same instance,
  // no shared module state needed.
  logProvider.addLogRecordProcessor({
    onEmit(logRecord) {
      for (const [k, v] of Object.entries(customAttrsProcessor.attrs)) logRecord.setAttribute(k, v)
    },
    shutdown()   { return Promise.resolve() },
    forceFlush() { return Promise.resolve() },
  })
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
    customAttrsProcessor,
  }
}
