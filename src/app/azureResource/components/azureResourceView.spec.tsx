/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { AzureResourceView } from './azureResourceView';
import { AccessVerificationState } from '../models/accessVerificationState';

jest.mock('react-router-dom', () => ({
    useParams: () => ({ hostName: 'hostName' }),
}));

describe('AzureResourceView', () => {
    it('matches snapshot when current resource is undefined', () => {
        expect(shallow(
            <AzureResourceView
                activeAzureResource={undefined}
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
                setActiveAzureResourceByHostName={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('calls setActiveAzureResourceByHostName when hostName changes', () => {
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());
        const setActiveAzureResourceByHostNameSpy = jest.fn();
        const wrapper = shallow(
            <AzureResourceView
                activeAzureResource={{
                    accessVerificationState: AccessVerificationState.Unauthorized,
                    hostName: 'hostName'
                }}
                setActiveAzureResourceByHostName={setActiveAzureResourceByHostNameSpy}
            />
        );

        wrapper.setProps({
            activeAzureResource: {
                accessVerificationState: AccessVerificationState.Unauthorized,
                hostName: 'oldHostName'
            },
            setActiveAzureResourceByHostName: setActiveAzureResourceByHostNameSpy
        });

        expect(setActiveAzureResourceByHostNameSpy).toHaveBeenCalledWith('hostName');
    });
});
