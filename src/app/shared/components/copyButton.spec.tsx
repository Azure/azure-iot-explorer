import * as React from 'react';
import { shallow } from 'enzyme';
import { CopyButton } from './copyButton';

describe('copyToClipboard', () => {
    it('matches snapshot', () => {
        expect(shallow(<CopyButton copyText='text'/>)).toMatchSnapshot();
    });

    it('matches snapshot disabled', () => {
        expect(shallow(<CopyButton copyText='text' disabled={true}/>)).toMatchSnapshot();
    });
});