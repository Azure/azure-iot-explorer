import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { Twin } from '../../../api/models/device';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';

export interface DeviceTwinStateInterface {
    deviceTwin: SynchronizationWrapper<Twin>;
}

export const deviceTwinStateInitial = Record<DeviceTwinStateInterface>({
    deviceTwin: null
});

export type DeviceTwinStateType = IM<DeviceTwinStateInterface>;
