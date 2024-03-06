import actionCreatorFactory from 'typescript-fsa';
import { ADD } from '../../constants/actionTypes';
import { DEVICE } from '../../constants/actionPrefixes';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { AddDeviceParameters } from '../../api/parameters/deviceParameters';

const deviceListCreator = actionCreatorFactory(DEVICE);
export const addDeviceAction = deviceListCreator.async<AddDeviceParameters, DeviceIdentity>(ADD);
