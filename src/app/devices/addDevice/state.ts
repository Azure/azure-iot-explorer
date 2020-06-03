import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export interface AddDeviceStateInterface {
    synchronizationStatus: SynchronizationStatus;
}

export const addDeviceStateInitial = Record<AddDeviceStateInterface>({
    synchronizationStatus: SynchronizationStatus.initialized
});

export type AddDeviceStateType = IM<AddDeviceStateInterface>;
