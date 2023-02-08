/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import './digitalTwinDetail.scss';

export const DigitalTwinModelId: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const { pnpState } = usePnpStateContext();
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;
    const moduleId = getModuleIdentityIdFromQueryString(search);

    return (
        <div className="step-one">
            <h4>{moduleId ? t(ResourceKeys.digitalTwin.steps.firstModule) : t(ResourceKeys.digitalTwin.steps.first)}</h4>
            <MaskedCopyableTextField
                ariaLabel={t(ResourceKeys.digitalTwin.modelId)}
                label={t(ResourceKeys.digitalTwin.modelId)}
                value={modelId}
                allowMask={false}
                readOnly={true}
            />
        </div>
    );
};
