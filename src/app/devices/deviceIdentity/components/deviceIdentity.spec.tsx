/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Toggle } from 'office-ui-fabric-react/lib/components/Toggle';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as IotHubContext from '../../../iotHub/hooks/useIotHubContext';

const mockUpdateDevice = jest.fn();
const componentProps = {
    deviceIdentity: null,
    synchronizationStatus: SynchronizationStatus.initialized,
    updateDeviceIdentity: mockUpdateDevice
};

const getComponent = (overrides = {}) => {
    const props = {
        ...overrides,
        ...componentProps
    };
    return <DeviceIdentityInformation {...props} />;
};

describe('deviceIdentity', () => {
    jest.spyOn(IotHubContext, 'useIotHubContext').mockReturnValue({ hostName: 'hostName'});

    context('snapshot', () => {
        it('matches snapshot', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot with identity wrapper', () => {
            expect(shallow(getComponent({
                identityWrapper: {}
            }))).toMatchSnapshot();
        });

        it('matches snapshot with auth type of None', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        type: DeviceAuthenticationType.None
                    },
                    deviceId: 'device1'
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with SymmetricKey auth type', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        symmetricKey: {
                            primaryKey: 'key'
                        },
                        type: DeviceAuthenticationType.SymmetricKey
                    },
                    deviceId: 'device1'
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with SelfSigned auth type', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        type: DeviceAuthenticationType.SelfSigned,
                        x509Thumbprint: {
                            primaryThumbprint: '123',
                            secondaryThumbprint: '456'
                        }
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with CA auth type', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        type: DeviceAuthenticationType.CACertificate
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with Synchronization Status of working', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        symmetricKey: {
                            primaryKey: 'key'
                        },
                        type: DeviceAuthenticationType.SymmetricKey
                    }
                },
                synchronizationStatus: SynchronizationStatus.working
            }))).toMatchSnapshot();
        });

        it('matches snapshot with Synchronization Status of updating', () => {
            expect(shallow(getComponent({
                deviceIdentity: {
                    authentication: {
                        symmetricKey: {
                            primaryKey: 'key'
                        },
                        type: DeviceAuthenticationType.SymmetricKey
                    }
                },
                synchronizationStatus: SynchronizationStatus.updating
            }))).toMatchSnapshot();
        });

        it('calls save', () => {
            const wrapper = mount(
                getComponent({
                    deviceIdentity: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        },
                        deviceId: 'device1'
                    }
                })
            );
            act(() => wrapper.find(Toggle).first().props().onChange(undefined, false));
            wrapper.update();

            const commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[0].onClick(null));
            expect(mockUpdateDevice).toBeCalled();
        });
    });
});
