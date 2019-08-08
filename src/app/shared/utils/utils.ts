/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const generateKey = (generator: (byteArray: Uint8Array) => void = randomValueGenerator): string => {
    const byteLength = 32;
    const byteArray = new Uint8Array(byteLength);
    generator(byteArray);

    let bytes = '';
    for (let i = 0; i < byteLength; i++) {
        bytes += String.fromCharCode(byteArray[i]);
    }

    return btoa(bytes);
};

export const randomValueGenerator = (byteArray: Uint8Array) => {
    // tslint:disable-next-line:no-any
    const windowAny = window as any;  // msCrypto is not typed.
    const crypto = windowAny.crypto || windowAny.msCrypto;
    crypto.getRandomValues(byteArray);
};

export const testRandomValueGenerator = (byteArray: Uint8Array) => {
    const defaultValue: number = 1;
    for (let i = 0; i < byteArray.length; i++) {
        byteArray[i] = defaultValue;
    }
};

export const validateKey = (key: string): boolean => {
    const pattern = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
    return pattern.test(key);
};

export const validateThumbprint = (key: string): boolean => {
    const pattern = new RegExp('^[A-Fa-f0-9]{40}$');
    return pattern.test(key);
};

export const validateDeviceId = (key: string): boolean => {
    const pattern = new RegExp('^[A-Za-z0-9-:.+%_#*?!(),=@;$\']{0,128}$');
    return pattern.test(key);
};
