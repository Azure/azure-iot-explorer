/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { AzureResourceView } from './azureResourceView';
import { AccessVerificationState } from '../models/accessVerificationState';

describe('AzureResourceView', () => {
    it('matches snapshot when current resource is undefined', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={undefined}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when current resource is verifying', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Verifying,
                    hostName: 'hostName'
                }}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when current resource is failed', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Failed,
                    hostName: 'hostName'
                }}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when current resource is unauthorized', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Unauthorized,
                    hostName: 'hostName'
                }}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when current resource is authorized', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Authorized,
                    hostName: 'hostName'
                }}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('calls setActiveAzureResourceByHostName when hostName changes', () => {
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());
        const setActiveAzureResourceByHostName = jest.fn();
        const wrapper = shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Unauthorized,
                    hostName: 'hostName'
                }}
                currentHostName="hostName"
                currentUrl="url"
                setActiveAzureResourceByHostName={setActiveAzureResourceByHostName}
            />
        );

        wrapper.setProps({
            activeAzureResource: {
                accessVerificationState: AccessVerificationState.Unauthorized,
                hostName: 'hostName'
            },
            currentHostName: 'newHostName',
            currentUrl: 'url',
            setActiveAzureResourceByHostName
        });

        expect(setActiveAzureResourceByHostName).toHaveBeenCalledWith('newHostName');
    });
});
