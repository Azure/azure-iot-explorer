import * as React from 'react';
import { shallow } from 'enzyme';
import { MonacoEditorComponent } from './monacoEditor';

describe('MonacoEditorComponent', () => {
    it('matches snapshot', () => {
        expect(shallow(<MonacoEditorComponent content="test" height={100} ariaLabel="test label" />)).toMatchSnapshot();
    });
});
