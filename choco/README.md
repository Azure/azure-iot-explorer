# Creating package for chocolatey

## Updating for release
To update chocolatey package for a new IoT Explorer build, you must follow these steps
1. Change `<version/>` tag in [azure-iot-explorer.nuspec](azure-iot-explorer.nuspec)
1. Change `$url` value in [chocolateyinstall.ps1](tools/chocolateyinstall.ps1)
1. Run `choco pack` PowerShell from this directory
1. Inspect and test the generated `azure-iot-explorer.x.x.x.nupkg in the current directory
1. Run `choco push --api-key {your api key goes here}` to publish to [Chocolatey](www.chocolatey.org)

## When to release
Update the chocolatey package after new release is published to [releases](github.com/Azure/azure-iot-explorer/releases/latest).