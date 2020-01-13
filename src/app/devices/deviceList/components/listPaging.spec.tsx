/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react';
import ListPaging from './listPaging';
import { testSnapshot, mountWithLocalization } from '../../../shared/utils/testHelpers';

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
        testSnapshot(
            <ListPaging
                continuationTokens={['', 'abc123']}
                currentPageIndex={0}
                fetchPage={jest.fn()}
            />
        );
    });
    it('matches snapshot on different page', () => {
        testSnapshot(
            <ListPaging
                continuationTokens={['', 'abc123', 'def456']}
                currentPageIndex={1}
                fetchPage={jest.fn()}
            />
        );
    });
    it('calls fetchPage on click', () => {
        const fetchPage = jest.fn();
        const wrapper = mountWithLocalization(
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
