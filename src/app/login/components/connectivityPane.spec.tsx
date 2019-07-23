/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { CopyableMaskField  } from '../../shared/components/copyableMaskField';
import { testWithLocalizationContext } from '../../shared/utils/testHelpers';
import ConnectivityPane from './connectivityPane';

describe('login/components/connectivityPane', () => {
    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location,
            push: jest.fn()
        },
        location,
    };

    it('matches snapshot', () => {
        const saveConnectionInfo = jest.fn();
        const wrapper = testWithLocalizationContext(
            <ConnectivityPane
                {...routerprops}
                connectionString=""
                saveConnectionInfo={saveConnectionInfo}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot for invalid connection string', () => {
        const saveConnectionInfo = jest.fn();
        const wrapper = testWithLocalizationContext(
            <ConnectivityPane
                {...routerprops}
                connectionString=""
                saveConnectionInfo={saveConnectionInfo}
            />
        );
        const input = wrapper.find(CopyableMaskField);
        input.props().onTextChange('invalid connection string');

        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot for empty connection string', () => {
        const saveConnectionInfo = jest.fn();
        const wrapper = testWithLocalizationContext(
            <ConnectivityPane
                {...routerprops}
                connectionString="invalid connection string"
                saveConnectionInfo={saveConnectionInfo}
            />
        );
        const input = wrapper.find(CopyableMaskField);
        input.props().onTextChange('');

        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot for valid connection string', () => {
        const saveConnectionInfo = jest.fn();
        const wrapper = testWithLocalizationContext(
            <ConnectivityPane
                {...routerprops}
                connectionString=""
                saveConnectionInfo={saveConnectionInfo}
            />
        );
        const input = wrapper.find(CopyableMaskField);
        input.props().onTextChange('HostName=a;SharedAccessKey=b;SharedAccessKeyName=c;');

        expect(wrapper).toMatchSnapshot();
    });
    it('calls saveConnectionInfo on button click', () => {
        const saveConnectionInfo = jest.fn();
        const wrapper = testWithLocalizationContext(
            <ConnectivityPane
                {...routerprops}
                connectionString="HostName=a;SharedAccessKey=b;SharedAccessKeyName=c;"
                saveConnectionInfo={saveConnectionInfo}
            />
        );
        const button = wrapper.find(PrimaryButton);
        button.props().onClick(null);
        expect(saveConnectionInfo).toBeCalledWith(
            {
                connectionString: 'HostName=a;SharedAccessKey=b;SharedAccessKeyName=c;',
                error: '',
                rememberConnectionString: undefined
            });
        expect(routerprops.history.push).toBeCalledWith('/devices');
    });
});
