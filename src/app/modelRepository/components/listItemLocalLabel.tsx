/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const ListItemLocalLabel: React.FC<{repoType: REPOSITORY_LOCATION_TYPE}> = ({repoType}) => {
    const { t } = useTranslation();

    return(
        <>
            {repoType === REPOSITORY_LOCATION_TYPE.Local &&
                <div className="labelSection">
                    <div className="label">{t(ResourceKeys.modelRepository.types.local.label)}</div>
                    <div className="description">{t(ResourceKeys.modelRepository.types.local.infoText)}</div>
                    </div>}
            {repoType === REPOSITORY_LOCATION_TYPE.LocalDMR &&
                <div className="labelSection">
                    <div className="label">{t(ResourceKeys.modelRepository.types.dmr.label)}</div>
                    <div className="description">
                        <Trans components={[<Link key="0" href="https://github.com/Azure/iot-plugandplay-models-tools/wiki/Resolution-Convention" target="_blank"/>]}>
                            {ResourceKeys.modelRepository.types.dmr.infoText}
                        </Trans>
                    </div>
                </div>}
        </>
    );
};
