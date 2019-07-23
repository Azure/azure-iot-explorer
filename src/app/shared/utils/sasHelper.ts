/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createHmac } from 'crypto';

export const generateSASToken = (repositoryId: string, audience: string, secret: string, keyName: string) => {
    const now = new Date();
    const ms = 1000;
    const expiry = (now.setDate(now.getDate() + 1) / ms).toFixed(0);
    const encodedServiceEndpoint = encodeURIComponent(audience);
    const encodedRepoId = encodeURIComponent(repositoryId);
    const signature = [encodedRepoId, encodedServiceEndpoint, expiry].join('\n').toLowerCase();
    const sigUTF8 = new Buffer(signature, 'utf8');
    const secret64bit = new Buffer(secret, 'base64');
    const hmac = createHmac('sha256', secret64bit);
    hmac.update(sigUTF8);
    const hash = encodeURIComponent(hmac.digest('base64'));
    return `SharedAccessSignature sr=${encodedServiceEndpoint}&sig=${hash}&se=${expiry}&skn=${keyName}&rid=${repositoryId}`;
};
