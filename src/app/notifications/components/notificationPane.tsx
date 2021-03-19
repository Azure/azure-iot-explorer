/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/components/Panel';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import { useGlobalStateContext } from '../../shared/contexts/globalStateContext';
import '../../css/_headerPane.scss';

export const NotificationPane: React.FC = () => {
    const { t } = useTranslation();

    const [ showPanel, setShowPanel ] = React.useState<boolean>(false);
    const { globalState } = useGlobalStateContext();
    const { hasNew } = globalState.notificationsState;

    const togglePanelVisibility = () => {
        setShowPanel(!showPanel);
    };

    return (
        <>
            <ActionButton
                iconProps={{
                    className: hasNew && 'new-notifications',
                    iconName: 'Ringer'
                }}
                onClick={togglePanelVisibility}
                text={t(ResourceKeys.header.notifications.show)}
                ariaLabel={t(ResourceKeys.header.notifications.show)}
            />

            <Panel
                className="headerPane"
                role="dialog"
                isOpen={showPanel}
                isLightDismiss={true}
                onDismiss={togglePanelVisibility}
                type={PanelType.smallFixedFar}
                isFooterAtBottom={true}
                closeButtonAriaLabel={t(ResourceKeys.common.close)}
            >
                <header className="panel-header">
                    <h2>{t(ResourceKeys.header.notifications.panel.title)}</h2>
                </header>
                <section aria-label={t(ResourceKeys.header.notifications.panel.title)}>
                    <span>{t(ResourceKeys.header.notifications.panel.redirect)}</span>
                    <Link
                        className="home-link"
                        onClick={togglePanelVisibility}
                        href={`#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}?${ROUTE_PARAMS.NAV_FROM}`}
                    >
                        {t(ResourceKeys.header.notifications.panel.redirectLink)}
                    </Link>
                </section>
            </Panel>
        </>
    );
};
