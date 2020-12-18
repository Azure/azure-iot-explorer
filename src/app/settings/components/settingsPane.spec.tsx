/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Panel } from 'office-ui-fabric-react/lib/components/Panel';
import { ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { act } from 'react-dom/test-utils';
import { SettingsPane } from './settingsPane';

describe('settingsPane', () => {
    it('matches snapshot', () => {
        expect(shallow(<SettingsPane/>)).toMatchSnapshot();
    });

    it('toggles visibility', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        const wrapper = mount(<SettingsPane/>);
        expect(wrapper.find(Panel).props().isOpen).toEqual(true);

        act(() => wrapper.find(ActionButton).first().props().onClick(null));
        wrapper.update()
        expect(wrapper.find(Panel).props().isOpen).toEqual(false);
    });
});
