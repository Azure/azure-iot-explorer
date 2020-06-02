/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { Notification } from '../../api/models/notification';
import { NotificationListEntry } from './notificationListEntry';
import '../../css/_notification.scss';

export interface NotificationListProps {
    hasNew: boolean;
    dismissNotifications: () => void;
    markAllNotificationsAsRead: () => void;
    notifications: Notification[];
}

export interface NotificationListState {
    showList: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = (props: NotificationListProps) => {
    const { t } = useLocalizationContext();

    const { dismissNotifications, notifications, markAllNotificationsAsRead, hasNew } = props;
    const [ showList, setShowList ] = React.useState<boolean>(false);

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
            markAllNotificationsAsRead();
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
