# End-to-end tests

The Playwright end-to-end tests launch the compiled Electron application against a real Azure IoT Hub. They are intended for manual use and are not part of CI.

The tests create and delete device identities whose IDs start with `e2e-`, and clean up test-owned module identities before their parent devices. Choose the target hub accordingly.

## Prerequisites

1. Install dependencies with `npm ci --legacy-peer-deps`.
1. Install the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).
1. Sign in with `az login` using an identity that can retrieve IoT Hub keys (`Microsoft.Devices/IotHubs/listkeys/action`) on the test hub.
1. Install the IoT extension with `az extension add --name azure-iot`.
1. Set the test hub subscription ID and name:

```powershell
$env:E2E_AZURE_SUBSCRIPTION_ID="<test-hub-subscription-id>"
$env:E2E_IOTHUB_NAME="<test-hub-name>"
```

The suite uses Azure CLI to retrieve the hub owner connection string at runtime, scoped explicitly to the configured subscription and hub. The connection string is held in memory and redacted from test diagnostics.

## Run the tests

Build the application and run all workflows:

```powershell
npm run test:e2e
```

After the application has already been built, run all tests or a selected workflow:

```powershell
npm run test:e2e:run
npm run test:e2e:run -- --grep "device twin"
```

The suite runs serially with a separate Electron profile per test. Numbered spec filenames group the report from smoke and connection checks through device, module, telemetry, and messaging workflows; tests remain isolated and must not depend on that order. The suite automatically removes every device it tracks, including after test failures.

The default suite covers connection persistence and validation, device discovery and bulk deletion, identity status and key rotation, device and module twins, telemetry lifecycle and enqueue-time retrieval, the custom connection-string path for the built-in Event Hub, cloud-to-device queue acceptance, direct-method success and failure paths, theme persistence, notifications, breadcrumbs, and model-repository persistence. Azure AD, cloud-to-device reception, IoT Plug and Play simulation, IoT Edge, and externally provisioned Event Hub workflows are excluded until deterministic test harnesses are available.

## Clean up test devices

To remove stale test devices left by an interrupted process:

```powershell
npm run test:e2e:cleanup
```

The cleanup command retrieves credentials through Azure CLI, then uses the IoT Hub SDK to delete only device IDs beginning with `e2e-`. Playwright traces, videos, automatic screenshots, and automatic accessibility snapshots are disabled because connection setup and identity pages contain secrets. Failure screenshots are captured only after the connection-string editor has closed.
