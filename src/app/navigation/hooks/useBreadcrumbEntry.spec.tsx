/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useBreadcrumbEntry } from './useBreadcrumbEntry';
import * as BreadcrumbContext from './useBreadcrumbContext';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: 'url', search: '', hash: '', state: null, key: 'default' })
}));

const TestComponent: React.FC = () => {
    useBreadcrumbEntry({ name: 'name', suffix: 'suffix', disableLink: true});
    return <></>;
}

describe('useBreadcrumbEntry', () => {
    it('calls register/unregister entry with expected parameters', () => {
        const registerEntry = jest.fn();
        const unregisterEntry = jest.fn();

        jest.spyOn(BreadcrumbContext, 'useBreadcrumbContext').mockReturnValue({
            stack: [],
            registerEntry,
            unregisterEntry
        });

        const { unmount } = render(<MemoryRouter><TestComponent /></MemoryRouter>);
        expect(registerEntry).toHaveBeenCalledWith({
            name: 'name',
            disableLink: true,
            path: 'url',
            suffix: 'suffix',
            url: 'url'
        });

        unmount();
        expect(unregisterEntry).toHaveBeenCalledWith({
            name: 'name',
            disableLink: true,
            path: 'url',
            suffix: 'suffix',
            url: 'url'
        });
    });
});