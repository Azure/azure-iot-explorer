import { ModelIdCasingNotMatchingException } from '../../../shared/utils/exceptions/modelIdCasingNotMatchingException';
import { ModelDefinition } from '../../../api/models/modelDefinition';
import { ModelRepositoryConfiguration } from '../../../shared/modelRepository/state';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';

export const getSplitInterfaceId = (fullName: string) => {
    // when component definition is inline, interfaceId is compose of parent file name and inline schema id concatenated with a slash
    return fullName.split('/');
};

export const getFlattenedModel = (model: ModelDefinition, splitInterfaceId: string[]) => {
    if (splitInterfaceId.length === 1) {
        return model;
    }
    else {
        // for inline component, the flattened model is defined under contents array's with matching schema @id
        const components = model.contents.filter((content: any) => // tslint:disable-line: no-any
            content['@type'] === 'Component' && typeof content.schema !== 'string' && content.schema['@id'] === splitInterfaceId[1]);
        return components[0];
    }
};

export const checkModelIdCasing = (model: ModelDefinition, id: string) => {
    if (model['@id'] !== id) {
        throw new ModelIdCasingNotMatchingException();
    }
};

export const getLocationSettingValue = (locations: ModelRepositoryConfiguration[], type: REPOSITORY_LOCATION_TYPE): string => {
    const filteredValue = locations.filter(location => location.repositoryLocationType === type)?.[0]?.value || '';
    return filteredValue.replace(/\/$/, ''); // remove trailing slash
};

export const getDmrParams = (path: string, interfaceId: string): {folderPath: string, fileName: string} => {
    // convert dtmi name to follow drm convention
    // for example: dtmi:com:example:Thermostat;1 -> dtmi/com/example/thermostat-1.json
    const fullPath = path.substring(0, path.lastIndexOf('/') + 1) + `${interfaceId.toLowerCase().replace(/:/g, '/').replace(';', '-')}.json`;
    // path will be converted to for example: original path/dtmi/com/example, file name will be thermostat-1.json
    return {folderPath: fullPath.substring(0, fullPath.lastIndexOf('/')), fileName: fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length)};
};
