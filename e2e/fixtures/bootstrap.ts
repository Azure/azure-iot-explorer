import { AzureCli } from './azureCli.ts';
import {
    createE2EEnvironment,
    E2EEnvironment,
    loadE2EConfiguration,
} from './environment.ts';

export interface E2EContext {
    azureCli: AzureCli;
    environment: E2EEnvironment;
}

export const bootstrapE2E = async (): Promise<E2EContext> => {
    const configuration = loadE2EConfiguration();
    const azureCli = new AzureCli(configuration);
    await azureCli.preflight();
    const connectionString = await azureCli.getIoTHubConnectionString();
    const environment = createE2EEnvironment(configuration, connectionString);
    return { azureCli, environment };
};
