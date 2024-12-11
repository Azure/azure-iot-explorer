// eslint-disable-next-line unicorn/filename-case
'use strict';
import * as React from 'react';

const MonacoEditor = () => React.createElement('div', null, 'MonacoEditorMock');
export const EditorWillMount = jest.fn();
export const monaco = {
  editor: {
    create: jest.fn(),
    defineTheme: jest.fn(),
    setModelLanguage: jest.fn(),
  },
};
export default MonacoEditor;

