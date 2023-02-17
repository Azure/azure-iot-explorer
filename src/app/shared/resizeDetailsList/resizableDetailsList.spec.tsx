/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import { ResizableDetailsList } from './resizableDetailsList';
import * as React from 'react';
import { SelectionMode } from '@fluentui/react';

describe('ResizableDetailsList', () => {
    it('matches snapshot', () => {
        expect(shallow(<ResizableDetailsList
            items={[]}
            columns={[]}
            selectionMode={SelectionMode.none}
            onRenderItemColumn={jest.fn()}
        />)).toMatchSnapshot();
    });
});
