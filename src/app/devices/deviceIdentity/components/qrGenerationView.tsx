/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';
import QRCode from 'react-qr-code';
import { CollapsibleSection } from '../../../shared/components/collapsibleSection';
import '../../../css/_qrGeneration.scss';
import { ResourceKeys } from '../../../../localization/resourceKeys';

const QR_SIZE = 200;

export interface QrGenerationDataProps {
    hostName: string;
    deviceId: string;
    deviceKey: string;
}
export const QrGenerationView: React.FC<QrGenerationDataProps> = (props: QrGenerationDataProps) => {
    const { t } = useTranslation();
    const { deviceId, deviceKey, hostName } = props;
    const connection = Buffer.from(JSON.stringify({
        deviceId,
        deviceKey,
        hostName
    })).toString('base64');

    return (
        <CollapsibleSection
            expanded={false}
            label={t(ResourceKeys.deviceIdentity.qrCode.label)}
            tooltipText={t(ResourceKeys.deviceIdentity.qrCode.toolTip)}
        >
            <div className="qrCodeGeneration">
                <h1>{t(ResourceKeys.deviceIdentity.qrCode.headerText)}</h1>
                <p>{t(ResourceKeys.deviceIdentity.qrCode.callToAction)}</p>
                <section className="storeLinks">
                    <Link
                        href="https://play.google.com/store/apps/details?id=com.iot_pnp"
                        target="_blank"
                    >
                        <img src="images/qrCodes/playstore.png" />
                    </Link>
                    <Link
                        href="https://apps.apple.com/app/iot-plug-and-play/id1563783687"
                        target="_blank"
                    >
                        <img src="images/qrCodes/appstore.png" />
                    </Link>
                </section>
                <section>
                    <div className="qrCode">
                        <QRCode value={connection} size={QR_SIZE} />
                    </div>
                </section>
            </div>
        </CollapsibleSection>
    );
};
