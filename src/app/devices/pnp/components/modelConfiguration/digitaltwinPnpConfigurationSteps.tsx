/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Link } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import './digitalTwinDetail.scss';
import { getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DigitalTwinModelId } from './digitalTwinModelId';
import { DigitalTwinModelDefinition } from './digitalTwinModelDefinition';

export const DigitaltwinPnpConfigurationSteps: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const { pnpState } = usePnpStateContext();
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;
    const moduleId = getModuleIdentityIdFromQueryString(search);

    return (
        <section className="device-detail">
            <div className="digitalTwin-steps">
                {modelId ?
                    <>
                        <DigitalTwinModelId/>
                        <DigitalTwinModelDefinition/>
                    </> :
                    <>
                        <span>{moduleId ? t(ResourceKeys.digitalTwin.steps.zeroModule) : t(ResourceKeys.digitalTwin.steps.zero)}</span>
                        <Link
                            href={t(ResourceKeys.settings.questions.questions.documentation.link)}
                            target="_blank"
                        >
                            {t(ResourceKeys.settings.questions.questions.documentation.text)}
                        </Link>
                    </>
                }
            </div>
        </section>
    );
};
