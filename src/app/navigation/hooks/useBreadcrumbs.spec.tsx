/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
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
    it('reports expected parameters on initial render', () => {
        const report = jest.fn();
        render(<TestComponent report={report} unRegister={false} />);

        expect(report).toHaveBeenCalledTimes(2);
        expect(report).toHaveBeenNthCalledWith(1, []);
        expect(report).toHaveBeenNthCalledWith(2, [{
            name: 'entry',
            path: 'path',
            suffix: '',
            url: ''
        }]);
    });

    it('unregisters entry when unRegister becomes true', () => {
        const report = jest.fn();
        const { rerender } = render(<TestComponent report={report} unRegister={false} />);

        report.mockClear();
        rerender(<TestComponent report={report} unRegister={true} />);

        expect(report).toHaveBeenLastCalledWith([]);
    });
});