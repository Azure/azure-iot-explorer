/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ConnectionStringProperties, ConnectionStringPropertiesProps } from './connectionStringProperties';

describe('ConnectionSTringProperties', () => {
    it('matches snapshot', () => {
        const props: ConnectionStringPropertiesProps = {
            connectionString: 'connectionString',
            hostName: 'hostName',
            sharedAccessKey: 'sharedAccessKey',
            sharedAccessKeyName: 'sharedAccessKeyName'
        };

        const wrapper = shallow(<ConnectionStringProperties {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });
});
