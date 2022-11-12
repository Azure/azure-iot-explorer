/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, SpinnerSize, Stack, MessageBarType, MessageBar } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';

export const Loader: React.FC<{monitoringData: boolean}> = ({monitoringData}) => {
    const { t } = useTranslation();

    return (
        <>
            {monitoringData &&
                <MessageBar
                    messageBarType={MessageBarType.info}
                >
                    <Stack horizontal={true} tokens={{ childrenGap: 10 }}>
                        <div>{t(ResourceKeys.deviceEvents.infiniteScroll.loading)}</div>
                        {<Spinner size={SpinnerSize.small} />}
                    </Stack>
                </MessageBar>
            }
        </>
    );
};
