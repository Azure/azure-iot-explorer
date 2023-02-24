import { ModelRepositoryStateInterface } from "../shared/modelRepository/state";
import { StringMap } from '../api/models/stringMap';

export interface ModelRepositoryFormOpsInterface {
    setDirtyFlag: (dirty: boolean) => void;
    setRepositoryLocationSettings: (settings: ModelRepositoryStateInterface) => void;
    setRepositoryLocationSettingsErrors: (errors: StringMap<string> ) => void;
}

export const getInitialModelRepositoryFormOps = (): ModelRepositoryFormOpsInterface => ({
    setDirtyFlag: () => undefined,
    setRepositoryLocationSettings:  () => undefined,
    setRepositoryLocationSettingsErrors:  () => undefined
});