const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
const grpc = require('@grpc/grpc-js');

const EXPORTER = process.env.EXPORTER || '';

module.exports = (serviceName) => {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });

    let exporter;
    if (EXPORTER.toLowerCase().startsWith('otlp')) {
        exporter = new OTLPTraceExporter({
            serviceName,
            credentials: grpc.credentials.createInsecure(),
        });
    } else {
        return console.error(`Unknown exporter ${EXPORTER}`);
    }

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    provider.register();

    registerInstrumentations({
        instrumentations: [
            new GrpcInstrumentation(),
        ],
    });

    return opentelemetry.trace.getTracer('grpc-js-example');
};