/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DIRECT_METHOD, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { invokeModuleDirectMethodSaga } from '../saga';
import { invokeModuleDirectMethodAction } from '../actions';
import { DirectMethodForm } from '../../../../devices/directMethod/components/directMethodForm';
import { ROUTE_PARAMS, ROUTE_PARTS } from '../../../../constants/routes';
import '../../../../css/_deviceDetail.scss';

const DEFAULT_TIMEOUT = 10;

export const ModuleDirectMethod: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const [ , dispatch ] = useAsyncSagaReducer(() => undefined, invokeModuleDirectMethodSaga, undefined);
    const [connectionTimeOut, setConnectionTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);
    const [methodName, setMethodName] = React.useState<string>('');
    const [payload, setPayload] = React.useState<string>('');
    const [responseTimeOut, setResponseTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);

    const navigateToModuleList = () => {
        const path = pathname.replace(/\/moduleIdentity\/moduleMethod\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

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
                farItems={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.back),
                        iconProps: {iconName: NAVIGATE_BACK},
                        key: NAVIGATE_BACK,
                        name: t(ResourceKeys.moduleIdentity.detail.command.back),
                        onClick: navigateToModuleList
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
        dispatch(invokeModuleDirectMethodAction.started({
            connectTimeoutInSeconds: connectionTimeOut,
            deviceId,
            methodName,
            moduleId,
            payload: getPayload(payload),
            responseTimeoutInSeconds: responseTimeOut
        }));
    };

    return (
        <>
            {showCommandBar()}
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
