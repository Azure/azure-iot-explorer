/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as fs from 'fs';

export interface StringMap<T> {
    [key: string]: T;
}

export interface SemanticUnit {
    displayName: string | StringMap<string>;
    abbreviation: string;
}

export const generateSemanticUnitDigest = () => {
    const rawSemanticUnitsFileLocation = './src/app/shared/units/semanticUnitsListRaw.json';
    const rawSemanticUnitsFileContents =  fs.readFileSync(rawSemanticUnitsFileLocation, 'utf-8');
    const rawSemanticUnitsFileObject = JSON.parse(rawSemanticUnitsFileContents);

    const semanticUnits: StringMap<SemanticUnit> = {};

    const minDtmiLength = 4;
    const extensionTypeIndex = 2;
    const extensionType = 'unit';
    const unitNameIndex = 3;

    // tslint:disable-next-line: no-any
    rawSemanticUnitsFileObject['@graph'].forEach((entry: any) => {
        const dtmi = entry['@id'].split(':');
        if (dtmi.length >= minDtmiLength && dtmi[extensionTypeIndex].toLowerCase() === extensionType) {
            const unitName = dtmi[unitNameIndex].split(';')[0];
            const displayName = entry.displayName;
            const abbreviation = entry.abbreviation || entry.symbol;

            semanticUnits[unitName] = {
                abbreviation,
                displayName
            };
        }
    });

    const semanticUnitsFileLocation = './src/app/shared/units/semanticUnitsList.json';
    const semanticUnitsFileContents = JSON.stringify(semanticUnits);
    fs.writeFileSync(semanticUnitsFileLocation, semanticUnitsFileContents);
};

generateSemanticUnitDigest();
