/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { ParseNestedMapNotSupportedException } from './exceptions/parseNestedMapNotSupportedException';
import { Exception } from './exceptions/exception';

export const dataToTwinConverter = (formData: any, settingSchema: ParsedJsonSchema, originalFormData?: any): {twin: any, error?: Exception} => { // tslint:disable-line:no-any
    if (!formData) {
        return {twin: formData};
    }

    try {
        const numberOfMaps = getNumberOfMapsInSchema(settingSchema);
        if (numberOfMaps > 0) {
            const formDataClone = JSON.parse(JSON.stringify(formData)); // important: needs this deep copy to prevent formData got changed
            const pathsWithKeyValuePair = findPathsTowardsMapType(settingSchema, [], numberOfMaps);
            return {twin: convertJsonFormDataToTwin(pathsWithKeyValuePair, settingSchema.title, formDataClone, originalFormData)};
        }
    } catch (ex) {
        return ({twin: formData, error: ex});
    }

    return {twin: formData};
};

export const twinToFormDataConverter = (twin: any, settingSchema: ParsedJsonSchema): {formData: any, error?: Exception} => { // tslint:disable-line:no-any
    if (!twin) {
        return {formData: twin};
    }

    try {
        const numberOfMaps = getNumberOfMapsInSchema(settingSchema);
        if (numberOfMaps > 0) {
            const twinClone = JSON.parse(JSON.stringify(twin)); // important: needs this deep copy to prevent inital twin got changed in store
            const pathsWithKeyValuePair = findPathsTowardsMapType(settingSchema, [], numberOfMaps);
            const formData = convertTwinToJsonFormData(twinClone, pathsWithKeyValuePair, settingSchema.title);
            return {formData};
        }
    }catch (ex) {
        return {formData: twin, error: ex};
    }

    return {formData: twin};
};

/* summary:
Find all the twin property path towards map type from json schema
*/
export const findPathsTowardsMapType = (
        settingSchema: ParsedJsonSchema,
        pathsWithKeyValuePair: PathTowardsMapWithKeyNameAndValueName[],
        numberOfPaths: number): PathTowardsMapWithKeyNameAndValueName[] => {
    const queue: SchemaNodeWithPath[] = []; // use a list of SchemaNodeWithPath to represent the queue of schema node and paths
    queue.unshift({
        node: settingSchema,
        path: [settingSchema.title]});
    let mapTypeFoundCounter = 0;

    /* tslint:disable: cyclomatic-complexity*/
    try {
        while (queue) {
            // get first element as path from the queue
            const currentElement = queue.pop();
            const currentNode = currentElement.node;

            if (isCurrentNodeMapType(currentNode)) {
                if (getNumberOfMapsInSchema(currentNode.items)) {
                    throw new ParseNestedMapNotSupportedException();
                }
                mapTypeFoundCounter += 1;
                pathsWithKeyValuePair.push({
                    keyName: currentNode.items.required[0],
                    path: currentElement.path,
                    valueName: currentNode.items.required[1]
                });
            }
            else if (currentNode.properties && getNumberOfMapsInSchema(currentNode.properties) > 0) // if currentNode is object type and contains map, enqueue its props
            {
                Object.keys(currentNode.properties).forEach(currentNodeKey => {
                    const newPath = [...currentElement.path]; // clone path to prevent change on reference
                    newPath.push(currentNodeKey);
                    queue.unshift({
                        node: currentNode.properties[currentNodeKey],
                        path: newPath
                    });
                });
            }

            if (mapTypeFoundCounter === numberOfPaths) { // found all the map types
                return pathsWithKeyValuePair;
            }
        }
    }
    catch (ex) {
        if (ex instanceof ParseNestedMapNotSupportedException) {
            throw ex;
        }
        return pathsWithKeyValuePair;
    }
    /* tslint-disable */

    return pathsWithKeyValuePair;
};

export const getNumberOfMapsInSchema = (settingSchema: ParsedJsonSchema): number => {
    const hasMatch = JSON.stringify(settingSchema).match(/additionalProperties/g);
    return hasMatch ? hasMatch.length : 0;
};

/* summary:
Use all the paths found in settingSchema to modify twin, and twin of object type would be converted to array type
*/
const convertTwinToJsonFormData = (twin: any, pathWithKeyValuePairs: PathTowardsMapWithKeyNameAndValueName[], parentKey: string): any => {  // tslint:disable-line:no-any
    if (!pathWithKeyValuePairs || pathWithKeyValuePairs.length === 0) {
        return;
    }

    const newTwin: any = {}; // tslint:disable-line:no-any
    newTwin[parentKey] = twin; // add a dummy head to the twin

    try {
        pathWithKeyValuePairs.forEach(pathWithPair => {
            const key = pathWithPair.path[pathWithPair.path.length - 1]; // get the key of the node to be modified
            const path = [...pathWithPair.path]; // clone path to prevent change on reference
            path.splice(-1, 1); // get the parent path towards the node needs to be modified

            let parentTwin = newTwin;
            let canFindRightKeyToModify = true;
            path.forEach(element => {
                parentTwin = parentTwin[element];
                if (!parentTwin) {
                    canFindRightKeyToModify = false;
                }
            });

            if (canFindRightKeyToModify) {
                const mapKeyName = pathWithPair.keyName;
                const mapValueName = pathWithPair.valueName;
                const newTwinNode: any[] = []; // tslint:disable-line:no-any

                if (parentTwin[key]) {
                    Object.keys(parentTwin[key]).forEach(twinKey => { // parentTwin[key] is the node to be modified
                        const element = {} as any; // tslint:disable-line:no-any
                        element[mapKeyName] = twinKey; // twin's object key is the value of the map's key
                        element[mapValueName] = parentTwin[key][twinKey]; // the correponding twin's value is the value of the map's value
                        newTwinNode.push(element);
                    });

                    parentTwin[key] = newTwinNode; // converted node to be array of objects
                }
            }
        });
    } catch {
        return;
    }

    return newTwin[parentKey];
};

/* summary:
Use all the paths found in settingSchema to modify form data, and form data of array type would be converted to object type
*/
const convertJsonFormDataToTwin = (
    pathWithKeyValuePairs: PathTowardsMapWithKeyNameAndValueName[],
    parentKey: string,
    formData: any, originalFormData?: any): any => {  // tslint:disable-line:no-any
    if (!pathWithKeyValuePairs || pathWithKeyValuePairs.length === 0) {
        return;
    }

    const newFormData: any = {}; // tslint:disable-line:no-any
    newFormData[parentKey] = formData; // add a dummy head to the formData

    let dummyOriginalFormData: any = {}; // tslint:disable-line:no-any
    dummyOriginalFormData[parentKey] = originalFormData; // add a dummy head to the formData

    try {
        pathWithKeyValuePairs.forEach(pathWithPair => {
            const key = pathWithPair.path[pathWithPair.path.length - 1]; // get the key of the node to be modified
            pathWithPair.path.splice(-1, 1); // get the parent path towards the node needs to be modified

            let parentFormData = newFormData;
            let canFindRightKeyToModify = true;
            pathWithPair.path.forEach(element => {
                parentFormData = parentFormData[element];
                if (!parentFormData) {
                    canFindRightKeyToModify = false;
                }
            });

            if (originalFormData) {
                pathWithPair.path.forEach(element => {
                    dummyOriginalFormData = dummyOriginalFormData[element];
                });
            }

            if (canFindRightKeyToModify) {
                const mapKeyName = pathWithPair.keyName;
                const mapValueName = pathWithPair.valueName;
                const newFormNode = {} as any; // tslint:disable-line:no-any

                if (parentFormData[key]) {
                    if (parentFormData[key].length  === 0) {
                        parentFormData[key] = null; // need to specifically set it to null to remove twin information
                        return formData;
                    }

                    let deletedKeys: string[] = [];
                    if (originalFormData && dummyOriginalFormData[key] &&  dummyOriginalFormData[key].length !== parentFormData[key].length) {
                        // find keys that have been deleted from the orignal form and specifically set its value to null
                        const oldKeys: string[] = dummyOriginalFormData[key].map((item: any) => item[mapKeyName]); // tslint:disable-line:no-any
                        const newKeys: string[] = parentFormData[key].map((item: any) => item[mapKeyName]); // tslint:disable-line:no-any
                        deletedKeys = oldKeys.filter((oldKey: string) => newKeys.indexOf(oldKey) === -1);
                    }

                    parentFormData[key].forEach((keyValue: any) => { // tslint:disable-line: no-any
                        try {
                            newFormNode[keyValue[mapKeyName]] = keyValue[mapValueName];
                        }
                        catch {
                            return;
                        }
                    });
                    if (deletedKeys) {
                        deletedKeys.forEach(deletedKey => {
                            newFormNode[deletedKey] = null;
                        });
                    }
                    parentFormData[key] = newFormNode;
                }
            }
        });
    } catch {
        return;
    }

    return newFormData[parentKey];
};

const isCurrentNodeMapType = (currentNode: any): boolean => { // tslint:disable-line:no-any
    return currentNode && currentNode.additionalProperties && currentNode.items && currentNode.items.required;
};

interface PathTowardsMapWithKeyNameAndValueName {
    keyName: string;
    path: string[];
    valueName: string;
}

interface SchemaNodeWithPath {
    node: any; // tslint:disable-line:no-any
    path: string[];
}
