
# Azure IoT Plug and Play (PnP) Device Explorer
[![Build Status](https://dev.azure.com/azure/azure-iot-explorer/_apis/build/status/Azure.azure-iot-explorer?branchName=master)](https://dev.azure.com/azure/azure-iot-explorer/_build/latest?definitionId=31&branchName=master)

## Table of Contents
- [Overview](#overview)
- [Development Setup](#development-setup)
- [Contributing](#contributing)

## Overview

This application provides users an easy and visualized way to interact with Azure IoT devices.

1. Go to the releases tab, download the installer corresponding to your platform and install.
2. Fill in IoT Hub connection string and that's it.

## Development Setup

### Setup
1. git clone https://github.com/Azure/azure-iot-explorer.git
2. run `npm install`
3. run `npm start`. This step may take a while, and it would automatically open a new tab in the default browser.
3. (optional) stop step 3, run `npm run build` and then run `npm run electron` will start the electron app locally

### Package
#### Windows
Run `npm run package:win` this will create a executable installation, an msi installation, and a stand-alone executable in the dist dirctory based on the version number in the package.json file.

#### Linux
Run `npm run package:linux` this will create snap and AppImage installations as well as tar.gz, tar.lz, and tar.xz formats. Changes to `build.linux.target` array entries can be used to only build specific output types.

#### Macintosh
Run `npm run package:mac` this will create dmg installations suitable for Macintosh OSX as well as mountable application.

#### Linux on Windows via Docker
Ensure your Docker environment is set up appropriately. Run `npm run docker` to pull and launch the electronland/electron-builder image and launch the current working directory as `/`. Some environments require `$(pwd)` to be replaced with the actual host directory. You can make the change as needed in package.json.

Once the electron-builder environment is loaded, run `npm run package:linux` to create the Linux installations as you would in a full Linux environment.

## Contributing


This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
