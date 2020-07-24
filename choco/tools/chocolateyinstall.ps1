
# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Unpublished works.
# --------------------------------------------------------------------------------------------

$ErrorActionPreference = 'Stop';
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = 'https://github.com/Azure/azure-iot-explorer/releases/download/v0.11.1/Azure.IoT.Explorer.preview.0.11.1.msi'

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  unzipLocation = $toolsDir
  fileType      = 'MSI'
  url           = $url
  url64bit      = $url64

  softwareName  = 'Azure IoT explorer'

  checksum      = 'CD4050AC2C5040D0802B2CED27A5BDF6B1D9C2F23C223D8FF4AA4284CF353A06'
  checksumType  = 'sha256'

  silentArgs    = "/qn /norestart"
  validExitCodes= @(0, 3010, 1641)
}

Install-ChocolateyPackage @packageArgs
