/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ConfirmationDialog } from './confirmationDialog';

describe('confirmationDialog', () => {

    it('matches snapshot', () => {
      const component = (
        <ConfirmationDialog
            t={jest.fn((value: string) => value)}
            messageKey="messageKey"
            onNo={jest.fn()}
            onYes={jest.fn()}
        />
    );
      expect(shallow(component)).toMatchSnapshot();
    });
});
