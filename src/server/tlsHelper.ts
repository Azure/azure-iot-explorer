/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as crypto from 'crypto';
import * as forge from 'node-forge';

export interface TlsCertificates {
    key: string;
    cert: string;
    fingerprint: string;
}

/**
 * Generates a self-signed TLS certificate for localhost.
 * Valid for 1 year, uses RSA 2048-bit key with SHA-256 signature.
 */
export function generateSelfSignedCert(): TlsCertificates {
    // Generate RSA key pair
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    // Set certificate properties
    cert.publicKey = keys.publicKey;
    cert.serialNumber = crypto.randomBytes(16).toString('hex');

    // Valid from now to 90 days from now
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + 90);

    // Certificate subject and issuer (self-signed)
    const attrs = [
        { name: 'commonName', value: 'localhost' },
        { name: 'organizationName', value: 'Azure IoT Explorer' },
        { shortName: 'OU', value: 'Local Development' }
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // Extensions for localhost usage
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: false
        },
        {
            name: 'keyUsage',
            digitalSignature: true,
            keyEncipherment: true
        },
        {
            name: 'extKeyUsage',
            serverAuth: true
        },
        {
            name: 'subjectAltName',
            altNames: [
                { type: 2, value: 'localhost' },  // DNS
                { type: 7, ip: '127.0.0.1' }      // IP
            ]
        }
    ]);

    // Sign with SHA-256
    cert.sign(keys.privateKey, forge.md.sha256.create());

    // Convert to PEM format
    const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
    const pemCert = forge.pki.certificateToPem(cert);

    // Calculate certificate fingerprint for verification
    const derCert = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
    const fingerprint = forge.md.sha256.create().update(derCert).digest().toHex();

    return {
        cert: pemCert,
        fingerprint: fingerprint.match(/.{2}/g)?.join(':').toUpperCase() || '',
        key: pemKey
    };
}
