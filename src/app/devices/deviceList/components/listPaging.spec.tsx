/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { ActionButton } from '@fluentui/react';
import { ListPaging } from './listPaging';

describe('components/devices/listPaging', () => {

    it('renders nothing with empty continuationTokens', () => {
        const component = (
            <ListPaging
                continuationTokens={null}
                currentPageIndex={0}
                fetchPage={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });

    it('matches snapshot with continuation tokens', () => {
        expect(shallow(
            <ListPaging
                continuationTokens={['', 'abc123']}
                currentPageIndex={0}
                fetchPage={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot on different page', () => {
        expect(shallow(
            <ListPaging
                continuationTokens={['', 'abc123', 'def456']}
                currentPageIndex={1}
                fetchPage={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('calls fetchPage on click', () => {
        const fetchPage = jest.fn();
        const wrapper = mount(
        <ListPaging
            continuationTokens={['', 'abc123', 'def456']}
            currentPageIndex={1}
            fetchPage={fetchPage}
        />);

        const link = wrapper.find(ActionButton).first();
        link.simulate('click');
        expect(fetchPage).toHaveBeenCalled();
    });
});
