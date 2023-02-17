/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { PrimaryButton } from '@fluentui/react';
import { ResizeDetailsListDialog } from './dialog';

describe('ResizeDetailsListDialog', () => {
    it('matches snapshot', () => {
        expect(shallow(<ResizeDetailsListDialog
                columnToEdit={undefined as any}
                detailsListRef={undefined as any}
                isDialogHidden={true}
                setIsDialogHidden={jest.fn()}
        />)).toMatchSnapshot();
    });

    it('matches snapshot when dialog is shown', () => {
        expect(shallow(<ResizeDetailsListDialog
                columnToEdit={undefined as any}
                detailsListRef={undefined as any}
                isDialogHidden={false}
                setIsDialogHidden={jest.fn()}
        />)).toMatchSnapshot();
    });

    it('clicks confirm button calls the action with expected parameter', () => {
        const setIsDialogHidden = jest.fn();
        const wrapper = shallow(<ResizeDetailsListDialog
            columnToEdit={{current: jest.fn()} as any}
            detailsListRef={{current: jest.fn()} as any}
            isDialogHidden={false}
            setIsDialogHidden={setIsDialogHidden}
        />);

        wrapper.find(PrimaryButton).props().onClick(undefined);
        expect(setIsDialogHidden).toHaveBeenCalledWith(true);
    });
});
