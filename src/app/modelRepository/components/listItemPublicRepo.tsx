/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, TextField } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { PUBLIC_REPO_HOSTNAME } from '../../constants/apiConstants';

export const ListItemPublicRepo: React.FC = () => {
    const { t } = useTranslation();

    return(
        <>
            <div className="labelSection">
                <div className="label">{t(ResourceKeys.modelRepository.types.public.label)}</div>
                <div className="description">
                    <Trans components={[<Link key="0" href="https://github.com/Azure/iot-plugandplay-models" target="_blank"/>]}>
                        {ResourceKeys.modelRepository.types.public.infoText}
                    </Trans></div>
                </div>
            <TextField
                className="local-folder-textbox"
                label={t(ResourceKeys.modelRepository.types.configurable.textBoxLabel)}
                ariaLabel={t(ResourceKeys.modelRepository.types.configurable.textBoxLabel)}
                value={PUBLIC_REPO_HOSTNAME}
                readOnly={true}
                prefix="https://"
            />
        </>
    );
};
