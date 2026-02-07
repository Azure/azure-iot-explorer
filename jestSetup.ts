/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setIconOptions } from '@fluentui/react';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

// tslint:disable-next-line: no-string-literal
global.Headers = jest.fn();
window.fetch = jest.fn();

// suppress icon warnings.
setIconOptions({
  disableWarnings: true,
});

Enzyme.configure({ adapter: new Adapter() });
document.execCommand = jest.fn(); // maskedCopyableTextField

// fix for smooth-dnd invocation error in test
Object.defineProperty(global, 'Node', {
  value: {firstElementChild: jest.fn()}
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));

jest.mock('./src/appConfig/appConfig', () => ({
  ...jest.requireActual('./src/appConfig/appConfig'), 
  appConfig: {
    hostMode: 'electron',  // Use electron mode since we only support Electron now
    telemetryConnString: 'InstrumentationKey=4e4b375e-0c49-42e3-8a51-20b22ce36181;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/'
}}));

// Mock the device API interface for IPC communication
const mockDataPlaneResponse = {
  body: { body: {} },
  statusCode: 200
};

(window as any).api_device = {
  dataPlaneRequest: jest.fn(() => Promise.resolve(mockDataPlaneResponse)),
  readLocalFile: jest.fn(() => Promise.resolve(null)),
  readLocalFileNaive: jest.fn(() => Promise.resolve('{}')),
  getDirectories: jest.fn(() => Promise.resolve([])),
  startEventHubMonitoring: jest.fn(() => Promise.resolve()),
  stopEventHubMonitoring: jest.fn(() => Promise.resolve()),
  onEventHubMessage: jest.fn(() => () => {}),
  sendMessageToDevice: jest.fn(() => Promise.resolve())
};

// Mock the settings interface
(window as any).api_settings = {
  useHighContrast: jest.fn(() => Promise.resolve(false))
};

// Mock the authentication interface
(window as any).api_authentication = {
  login: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve()),
  getProfileToken: jest.fn(() => Promise.resolve(null))
};

// Mock the credentials interface  
(window as any).api_credentials = {
  storeCredential: jest.fn(() => Promise.resolve(null)),
  getCredential: jest.fn(() => Promise.resolve(null)),
  deleteCredential: jest.fn(() => Promise.resolve(null)),
  listCredentials: jest.fn(() => Promise.resolve([])),
  isEncryptionAvailable: jest.fn(() => Promise.resolve(false))
};
