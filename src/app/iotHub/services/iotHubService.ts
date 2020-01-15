import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { AzureResourceManagementEndpoint } from '../../azureResourceIdentifier/models/azureResourceManagementEndpoint';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { generateResourceIdentifierUrlPath } from '../../api/shared/resourceIdentifierHelper';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';
import { HttpError } from '../../api/models/httpError';

const apiVersion = '2018-04-01';

export interface GetSharedAccessSignatureAuthorizationRulesParameters {
    azureResourceManagementEndpoint: AzureResourceManagementEndpoint;
    azureResourceIdentifier: AzureResourceIdentifier;
}
export const getSharedAccessPolicies = async (parameters: GetSharedAccessSignatureAuthorizationRulesParameters): Promise<SharedAccessSignatureAuthorizationRule[]> => {
    const { azureResourceManagementEndpoint, azureResourceIdentifier } = parameters;
    const { authorizationToken, endpoint } = azureResourceManagementEndpoint;

    const resourceIdentifierPath = generateResourceIdentifierUrlPath(azureResourceIdentifier);
    const requestUrl = `https://${endpoint}/${resourceIdentifierPath}/listkeys?api-version=${apiVersion}`;

    const serviceRequestParams: RequestInit = {
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Post
    };
    const response = await fetch(requestUrl, serviceRequestParams);
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    const responseBody = await response.json() as { value: SharedAccessSignatureAuthorizationRule[] };
    return responseBody.value;
};
