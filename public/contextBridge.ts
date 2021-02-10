import { ipcRenderer, contextBridge } from 'electron';
import { MESSAGE_CHANNELS, API_KEY } from './constants';

contextBridge.exposeInMainWorld(API_KEY, {
    useHighContrast: async (): Promise<boolean> => {
        const result = await ipcRenderer.invoke(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST);
        return result;
    }
});
