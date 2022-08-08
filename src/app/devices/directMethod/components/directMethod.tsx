/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CommandBar } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { DIRECT_METHOD } from '../../../constants/iconNames';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { invokeDirectMethodSaga } from '../saga';
import { invokeDirectMethodAction } from '../actions';
import { DirectMethodForm } from './directMethodForm';
import '../../../css/_deviceDetail.scss';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES, TELEMETRY_USER_ACTIONS } from '../../../../app/constants/telemetry';

const DEFAULT_TIMEOUT = 10;

export const DirectMethod: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ , dispatch ] = useAsyncSagaReducer(() => undefined, invokeDirectMethodSaga, undefined);
    const [connectionTimeOut, setConnectionTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);
    const [methodName, setMethodName] = React.useState<string>('');
    const [payload, setPayload] = React.useState<string>('');
    const [responseTimeOut, setResponseTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.DEVICE_DIRECT_METHOD});
    }, []); // tslint:disable-line: align

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.directMethod.invokeMethodButtonText),
                        disabled: !formReady(),
                        iconProps: {iconName: DIRECT_METHOD},
                        key: DIRECT_METHOD,
                        name: t(ResourceKeys.directMethod.invokeMethodButtonText),
                        onClick: onInvokeMethodClickHandler
                    }
                ]}
            />
        );
    };

    const formReady = (): boolean => !!methodName;
    const getPayload = (content: string) => {
        // payload could be json or simply string
        try {
            return JSON.parse(content);
        } catch {
            return content;
        }
    };

    const onInvokeMethodClickHandler = () => {
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.DEVICE_INVOKE_DIRECT_METHOD);
        dispatch(invokeDirectMethodAction.started({
            connectTimeoutInSeconds: connectionTimeOut,
            deviceId,
            methodName,
            payload: getPayload(payload),
            responseTimeoutInSeconds: responseTimeOut
        }));
    };

    return (
        <>
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.directMethod.headerText}
                tooltip={ResourceKeys.directMethod.tooltip}
            />
            <DirectMethodForm
                methodName={methodName}
                connectionTimeOut={connectionTimeOut}
                responseTimeOut={responseTimeOut}
                setMethodName={setMethodName}
                setPayload={setPayload}
                setConnectionTimeOut={setConnectionTimeOut}
                setResponseTimeOut={setResponseTimeOut}
            />
        </>
    );
};
