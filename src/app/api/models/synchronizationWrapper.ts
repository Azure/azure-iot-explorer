import { SynchronizationStatus } from './synchronizationStatus';
export interface SynchronizationWrapper<T> {
    payload?: T;
    synchronizationStatus: SynchronizationStatus;
}
