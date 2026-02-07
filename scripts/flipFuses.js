/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
/**
 * Electron Fuses Configuration Script
 * 
 * This script is run by electron-builder after packaging to flip security fuses.
 * Fuses are compile-time flags that disable certain Electron features for security.
 * 
 * See: https://www.electronjs.org/docs/latest/tutorial/fuses
 */
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');
const path = require('path');

/**
 * afterPack hook for electron-builder
 * @param {Object} context - electron-builder context
 */
module.exports = async function afterPack(context) {
    const { electronPlatformName, appOutDir } = context;
    
    // Determine the path to the Electron binary based on platform
    let electronBinaryPath;
    
    switch (electronPlatformName) {
        case 'win32':
            electronBinaryPath = path.join(appOutDir, 'Azure IoT Explorer Preview.exe');
            break;
        case 'darwin':
            electronBinaryPath = path.join(
                appOutDir, 
                'Azure IoT Explorer Preview.app', 
                'Contents', 
                'MacOS', 
                'Azure IoT Explorer Preview'
            );
            break;
        case 'linux':
            electronBinaryPath = path.join(appOutDir, 'azure-iot-explorer');
            break;
        default:
            console.warn(`Unknown platform: ${electronPlatformName}, skipping fuse configuration`);
            return;
    }
    
    console.log(`Flipping fuses for: ${electronBinaryPath}`);
    
    try {
        await flipFuses(electronBinaryPath, {
            version: FuseVersion.V1,
            
            // Disable running as Node.js via ELECTRON_RUN_AS_NODE env var
            // This prevents attackers from using your app as a Node.js runtime
            [FuseV1Options.RunAsNode]: false,
            
            // Enable cookie encryption for better session security
            [FuseV1Options.EnableCookieEncryption]: true,
            
            // Disable Node.js CLI inspect arguments (--inspect, --inspect-brk)
            // Prevents remote debugging of production builds
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            
            // Disable NODE_OPTIONS environment variable
            // Prevents injection of Node.js options into your app
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            
            // Enable embedded ASAR integrity validation
            // Ensures the app package hasn't been tampered with
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            
            // Only load the app from the default app.asar location
            // Prevents loading malicious code from other locations
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        });
        
        console.log('Successfully configured Electron fuses');
    } catch (error) {
        console.error('Failed to flip fuses:', error);
        throw error; // Fail the build if fuses can't be set
    }
};
