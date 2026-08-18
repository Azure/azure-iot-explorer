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

    // MessageBar renders role="group" and relies on Fluent's announce context, which is a
    // no-op unless an AnnounceProvider is mounted. Wrap it in a live region that is always
    // present in the DOM so the status text is announced when monitoring starts (MAS 4.1.3).
    return (
        <div role="status" aria-live="polite">
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
        </div>
    );
};
