/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, MessageBar, MessageBarBody } from '@fluentui/react-components';
import { ResourceKeys } from '../../../../localization/resourceKeys';

export const Loader: React.FC<{monitoringData: boolean}> = ({monitoringData}) => {
    const { t } = useTranslation();

    return (
        <>
            {monitoringData &&
                <MessageBar
                    intent="info"
                >
                    <MessageBarBody>
                    <div className="loader-content">
                        <div>{t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</div>
                        {<Spinner size="small" />}
                    </div>
                    </MessageBarBody>
                </MessageBar>
            }
        </>
    );
};
