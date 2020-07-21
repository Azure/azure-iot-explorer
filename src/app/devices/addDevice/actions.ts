import actionCreatorFactory from 'typescript-fsa';
import { ADD } from '../../constants/actionTypes';
import { DEVICE } from '../../constants/actionPrefixes';
import { DeviceIdentity } from '../../api/models/deviceIdentity';

const deviceListCreator = actionCreatorFactory(DEVICE);
export const addDeviceAction = deviceListCreator.async<DeviceIdentity, DeviceIdentity>(ADD);
