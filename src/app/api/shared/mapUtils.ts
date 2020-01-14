export const mapPropertyArrayToObject = (fieldNames: string[], fieldValues: string[]): object => {
    const result = {} as any; // tslint:disable-line:no-any
    fieldNames.forEach((fieldName, index) => {
        result[fieldName] = index < fieldValues.length ? fieldValues[index] : undefined;
    });

    return result;
};
