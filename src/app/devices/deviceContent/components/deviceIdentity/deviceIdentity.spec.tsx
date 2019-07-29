/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import DeviceIdentity from './deviceIdentity';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
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
const dispatchProps = {
    getDeviceIdentity: jest.fn(),
    updateDeviceIdentity: jest.fn(),
};

const getComponent = (overrides = {}) => {
    const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
    const props = {
        connectionString,
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
                    deviceIdentity: {
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
                    deviceIdentity: {
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
                    deviceIdentity: {
                        authentication: {
                            type: DeviceAuthenticationType.SelfSigned
                        }
                    }
                }
            }));
        });
        it('matches snapshot with CA auth type', () => {
            testSnapshot(getComponent({
                identityWrapper: {
                    deviceIdentity: {
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
                    deviceIdentity: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        }
                    },
                    deviceIdentitySynchronizationStatus: SynchronizationStatus.working,
                }
            }));
        });
        it('matches snapshot with Synchronization Status of updating', () => {
            testSnapshot(getComponent({
                identityWrapper: {
                    deviceIdentity: {
                        authentication: {
                            symmetricKey: {
                                primaryKey: 'key'
                            },
                            type: DeviceAuthenticationType.SymmetricKey
                        }
                    },
                    deviceIdentitySynchronizationStatus: SynchronizationStatus.updating,
                }
            }));
        });
    });
});
