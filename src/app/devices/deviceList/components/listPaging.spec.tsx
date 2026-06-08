/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListPaging, ListPagingDataProps, ListPagingDispatchProps } from './listPaging';

describe('ListPaging', () => {
    const defaultProps: ListPagingDataProps & ListPagingDispatchProps = {
        continuationTokens: ['', 'token1', 'token2'],
        currentPageIndex: 0,
        fetchPage: jest.fn()
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders pages label', () => {
        render(<ListPaging {...defaultProps}/>);

        expect(screen.getByText('deviceLists.paging.pages')).toBeInTheDocument();
    });

    it('renders page buttons for each continuation token', () => {
        render(<ListPaging {...defaultProps}/>);

        const navigation = screen.getByRole('navigation');
        expect(navigation).toBeInTheDocument();
        const listItems = navigation.querySelectorAll('[role="list"] > div');
        expect(listItems.length).toBe(3);
    });

    it('calls fetchPage with correct page index when a non-current page button is clicked', () => {
        const fetchPage = jest.fn();
        render(<ListPaging {...defaultProps} fetchPage={fetchPage}/>);

        // Page 0 is current (rendered as span not button), pages 1 and "»" are buttons
        // buttons[0] corresponds to page index 1
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(fetchPage).toHaveBeenCalledWith(1);
    });
});
