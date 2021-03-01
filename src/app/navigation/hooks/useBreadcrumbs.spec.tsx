/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { mount } from 'enzyme'
import { useBreadcrumbs } from './useBreadcrumbs';
import { BreadcrumbEntry } from '../model';

interface TestComponentProps {
    report(stack: BreadcrumbEntry[]): void;
    unRegister: boolean;
}
const TestComponent: React.FC<TestComponentProps> = ({report, unRegister}) => {
    const { stack, registerEntry, unregisterEntry } = useBreadcrumbs();
    report(stack);

    const entry = {
        name: 'entry',
        path: 'path',
        suffix: '',
        url: ''
    };

    React.useEffect(() => {
        registerEntry(entry)
    }, []);

    React.useEffect(() => {
        if (unRegister) {
            unregisterEntry(entry)
        }
    }, [unRegister]);

    return <></>
};

describe('useBreadcrumbs', () => {
    it('reports expected parameters', () => {
        const report = jest.fn();
        const wrapper = mount(<TestComponent report={report} unRegister={false} />);

        expect(report).toHaveBeenCalledTimes(2);
        expect(report).toHaveBeenNthCalledWith(1, []);
        expect(report).toHaveBeenNthCalledWith(2, [{
            name: 'entry',
            path: 'path',
            suffix: '',
            url: ''
        }]);

        wrapper.setProps({report, unRegister: true});
        wrapper.update();

        expect(report).toHaveBeenLastCalledWith([]);
    });
});
