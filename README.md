
# Azure IoT Plug and Play (PnP) Device Explorer
[![Build Status](https://dev.azure.com/azure/azure-iot-explorer/_apis/build/status/Azure.azure-iot-explorer?branchName=master)](https://dev.azure.com/azure/azure-iot-explorer/_build/latest?definitionId=31&branchName=master)

## Table of Contents
- [Overview](#overview)
- [Development Setup](#development-setup)
- [Contributing](#contributing)

## Overview

This application provides users an easy and visualized way to interact with Azure IoT devices.

1. Go to the releases tab, download the installer corresponding to your platform and install.
1. Fill in IoT Hub connection string and that's it.

![image](https://user-images.githubusercontent.com/5489222/61984482-6af89f80-afb9-11e9-8b2f-d6905301d9a9.png)

## Development Setup

### Setup
1. Open a Node capable command prompt
1. git clone https://github.com/Azure/azure-iot-explorer.git
1. run `npm install`
1. run `npm start`. A new tab in your default browser will be opened automatically and site would be running locally
1. (optional) stop step 3, run `npm run build` and then run `npm run electron`. The electron app would start locally using the bits generated in the dist folder

If you'd like to package the app yourself, please refer to [FAQ](https://github.com/Azure/azure-iot-explorer/wiki/FAQ)

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
