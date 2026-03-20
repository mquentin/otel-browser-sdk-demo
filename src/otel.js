// otel.js — SDK initialisation + processors

import { trace } from '@opentelemetry/api'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { ExportResultCode } from '@opentelemetry/core'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
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

// ── CustomAttributesProcessor ─────────────────────────────────────────────────
// Stamps a set of key-value pairs onto every span as it starts.
// Call .update() any time the user changes custom attributes.

export class CustomAttributesProcessor {
  attrs = {}

  update(attrs) {
    this.attrs = { ...attrs }
  }

  onStart(span) {
    for (const [k, v] of Object.entries(this.attrs)) {
      span.setAttribute(k, v)
    }
  }

  onEnd() {}
  shutdown()    { return Promise.resolve() }
  forceFlush()  { return Promise.resolve() }
}

// ── initOtel ──────────────────────────────────────────────────────────────────

export function initOtel(config) {
  const customAttrsProcessor = new CustomAttributesProcessor()

  const otlpExporter = new OTLPTraceExporter(config.otlpExporterConfig)

  const provider = new WebTracerProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]:    config.serviceName,
      [ATTR_SERVICE_VERSION]: config.serviceVersion,
    }),
  })

  provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter, {
    maxExportBatchSize:    10,
    scheduledDelayMillis: 1_000,
  }))
  provider.addSpanProcessor(new SimpleSpanProcessor(new UISpanExporter()))
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
  provider.addSpanProcessor(customAttrsProcessor)

  provider.register()

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
    customAttrsProcessor,
  }
}
