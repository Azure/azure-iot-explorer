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

export const compare = (obj1: any, obj2: any): boolean => { // tslint:disable-line:no-any
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
    }

    const type = typeof obj1;

    switch (type) {
        case 'object':
            for (const prop in obj1) {
                if (obj1.hasOwnProperty(prop) && obj2.hasOwnProperty(prop)) {
                    if (!compare(obj1[prop], obj2[prop])) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            break;
        case 'function':
            return true;
        case 'undefined':
            return true;
        default:
            if (obj1 !== obj2) {
                return false;
            }
            break;
    }

    return true;
}; // tslint:disable-line
