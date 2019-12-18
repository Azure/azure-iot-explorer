import { AzureResource } from './models/azureResource';

export interface AzureResourceState {
    currentAzureResource: AzureResource | undefined;

}

export const azureResourceStateInitial = (): AzureResourceState => {
    return {
        currentAzureResource: undefined
    };
};
