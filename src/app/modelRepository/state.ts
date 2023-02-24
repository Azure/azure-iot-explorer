import { ModelRepositoryStateInterface } from "../shared/modelRepository/state";
import { StringMap } from '../api/models/stringMap';
import { REPOSITORY_LOCATION_TYPE } from "../constants/repositoryLocationTypes";

export interface ModelRepositoryFormStateInterface {
    dirty: boolean;
    repositoryLocationSettings: ModelRepositoryStateInterface;
    repositoryLocationSettingsErrors: StringMap<string>;
}

export const getInitialModelRepositoryFormState = (): ModelRepositoryFormStateInterface => ({
    dirty: false,
    repositoryLocationSettings: [{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public, value: '' }],
    repositoryLocationSettingsErrors: {}
});