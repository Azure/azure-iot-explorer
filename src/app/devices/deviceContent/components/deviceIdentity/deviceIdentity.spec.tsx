/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import DeviceIdentity from './deviceIdentity';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = `/`;

const location: any = { // tslint:disable-line:no-any
    pathname
};
const routerprops: any = { // tslint:disable-line:no-any
    history: {
        location
    },
    location,
    match: {}
};

const mockUpdateDevice = jest.fn();
const dispatchProps = {
    getDeviceIdentity: jest.fn(),
    updateDeviceIdentity: mockUpdateDevice
};

const getComponent = (overrides = {}) => {
    const activeAzureResourceHostName = 'test-string.azure-devices.net';
    const props = {
        activeAzureResourceHostName,
        ...routerprops,
        ...overrides,
        ...dispatchProps
    };
    return <DeviceIdentity {...props} />;
};

describe('devices/components/deviceIdentity', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            testSnapshot(getComponent());
        });

        it('matches snapshot with identity wrapper', () => {
            testSnapshot(getComponent({
                identityWrapper: {}
            }));
        });

        it('matches snapshot with auth type of None', () => {
            testSnapshot(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            type: DeviceAuthenticationType.None
                        },
                        deviceId: 'device1'
                    }
                }
            }));
        });

        it('matches snapshot with SymmetricKey auth type', () => {
            testSnapshot(getComponent({
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
            }));
        });

        it('matches snapshot with SelfSigned auth type', () => {
            testSnapshot(getComponent({
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
            }));
        });

        it('matches snapshot with CA auth type', () => {
            testSnapshot(getComponent({
                identityWrapper: {
                    payload: {
                        authentication: {
                            type: DeviceAuthenticationType.CACertificate
                        }
                    }
                }
            }));
        });

        it('matches snapshot with Synchronization Status of working', () => {
            testSnapshot(getComponent({
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
            }));
        });

        it('matches snapshot with Synchronization Status of updating', () => {
            testSnapshot(getComponent({
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
            }));
        });

        it('calls save', () => {
            const wrapper = mountWithLocalization(
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
