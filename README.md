# Sample NodeJs gRPC app

This is a sample app instrumented with opentelemetry and by default sends data to SigNoz hosted locally on machine.

### Running the code

Start go grpc server and grpc client using below commands

1. Grpc-Server
```
npm run otlp:server
```

2. Grpc-Client
```
npm run otlp:client
```

View traces, logs and metrics:

- View the metrics in signoz, go to http://localhost:3301/application 
