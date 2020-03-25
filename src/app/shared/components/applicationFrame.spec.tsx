import * as React from 'react';
import { shallow } from 'enzyme';
import { withApplicationFrame, ApplicationFrame } from './applicationFrame';

describe('ApplicationFrame', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<ApplicationFrame/>);
        expect(wrapper).toMatchSnapshot();
    });
});

describe('withApplicationFrame', () => {
    it('matches snapshot', () => {
        const result = withApplicationFrame(() => {
            return (<div>Hello Component</div>);
        });

        const wrapper = shallow(result({}));
        expect(wrapper).toMatchSnapshot();
    });
});
