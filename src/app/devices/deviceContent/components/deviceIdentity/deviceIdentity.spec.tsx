/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { mountWithStoreAndRouter } from '../../../../shared/utils/testHelpers';

const mockUpdateDevice = jest.fn();
const dispatchProps = {
    getDeviceIdentity: jest.fn(),
    updateDeviceIdentity: mockUpdateDevice
};

const getComponent = (overrides = {}) => {
    const activeAzureResourceHostName = 'test-string.azure-devices.net';
    const props = {
        activeAzureResourceHostName,
        ...overrides,
        ...dispatchProps
    };
    return <DeviceIdentityInformation {...props} />;
};

describe('devices/components/deviceIdentity', () => {
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
                identityWrapper: {
                    payload: {
                        authentication: {
                            type: DeviceAuthenticationType.None
                        },
                        deviceId: 'device1'
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with SymmetricKey auth type', () => {
            expect(shallow(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        },
                        deviceId: 'device1'
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with SelfSigned auth type', () => {
            expect(shallow(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            type: DeviceAuthenticationType.SelfSigned,
                            x509Thumbprint: {
                                primaryThumbprint: '123',
                                secondaryThumbprint: '456'
                            }
                        }
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with CA auth type', () => {
            expect(shallow(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            type: DeviceAuthenticationType.CACertificate
                        }
                    }
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with Synchronization Status of working', () => {
            expect(shallow(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        }
                    },
                    synchronizationStatus: SynchronizationStatus.working,
                }
            }))).toMatchSnapshot();
        });

        it('matches snapshot with Synchronization Status of updating', () => {
            expect(shallow(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        }
                    },
                    synchronizationStatus: SynchronizationStatus.updating,
                }
            }))).toMatchSnapshot();
        });

        it('calls save', () => {
            const wrapper = mountWithStoreAndRouter(
                getComponent({
                    identityWrapper: {
                        payload: {
                            authentication: {
                                symmetricKey: {
                                    primaryKey: 'key'
                                },
                                type: DeviceAuthenticationType.SymmetricKey
                            },
                            deviceId: 'device1'
                        }
                    }
                }),
                true
            );
            wrapper.find(Toggle).first().instance().props.onChange({ target: null}, false);
            wrapper.update();

            const commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[0].onClick(null);
            expect(mockUpdateDevice).toBeCalled();
        });
    });
});
