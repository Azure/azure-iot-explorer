/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/components/Panel';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationListEntry } from './notificationListEntry';
import { useGlobalStateContext } from '../../shared/contexts/globalStateContext';
import { clearNotificationsAction, markAllNotificationsAsReadAction } from '../../shared/global/actions';
import '../../css/_notification.scss';

export const NotificationList: React.FC = () => {
    const { t } = useTranslation();

    const { globalState, dispatch } = useGlobalStateContext();
    const { hasNew, notifications } = globalState.notificationsState;
    const [ showList, setShowList ] = React.useState<boolean>(false);

    const dismissNotifications = () => dispatch(clearNotificationsAction());

    const onRenderHeader = (): JSX.Element => {
        return (
            <div className="notification-list-header">
                <h2>{t(ResourceKeys.header.notifications.panel.title)}</h2>

                {notifications.length > 0 &&
                    <div className="commands">
                        <Link onClick={dismissNotifications}>{t(ResourceKeys.header.notifications.dismiss)}</Link>
                    </div>
                }

                <hr className="notification-list-divider" />
            </div>
        );
    };

    const onCloseDisplay = () => {
        setShowList(false);
    };

    const onToggleDisplay = () => {
        if (showList) {
            dispatch(markAllNotificationsAsReadAction());
        }
        setShowList(!showList);
    };

    return (
        <>
            <ActionButton
                id="notifications"
                iconProps={
                    {
                        className: hasNew && 'new-notifications',
                        iconName: 'Ringer'
                    }
                }
                onClick={onToggleDisplay}
                text={t(ResourceKeys.header.notifications.show)}
                ariaLabel={t(showList ?
                    ResourceKeys.header.notifications.hide :
                    ResourceKeys.header.notifications.show)}
            />

            <Panel
                isOpen={showList}
                type={PanelType.smallFixedFar}
                isBlocking={true}
                onRenderHeader={onRenderHeader}
                onDismiss={onCloseDisplay}
                closeButtonAriaLabel={t(ResourceKeys.common.close)}
            >
                <div>
                    {notifications.length === 0 &&
                        <div>{t(ResourceKeys.header.notifications.panel.noNotifications)}</div>
                    }

                    {notifications.map((notification, index) => {
                            return (
                                <div key={index}>
                                    <NotificationListEntry notification={notification} showAnnoucement={false} />
                                    <hr className="notification-list-divider" />
                                </div>);
                        })
                    }

                </div>
            </Panel>
        </>
    );
};
