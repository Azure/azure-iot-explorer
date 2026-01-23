/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setIconOptions } from '@fluentui/react';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { appConfig } from './src/appConfig/appConfig'

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
    hostMode: 'browser',  // Use browser mode in tests to simplify endpoint URLs
    controllerPort: 8081,
    telemetryConnString: 'InstrumentationKey=4e4b375e-0c49-42e3-8a51-20b22ce36181;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/'
}}));

// Mock secureFetch to pass through to regular fetch for tests
jest.mock('./src/app/api/shared/secureFetch', () => ({
  secureFetch: jest.fn((url, options) => window.fetch(url, options)),
  initializeSecureFetch: jest.fn(() => Promise.resolve()),
  getSecureWebSocketUrl: jest.fn((url) => url),
  resetSecureFetch: jest.fn()
}));
