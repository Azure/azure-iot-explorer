/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
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

export class NotificationList extends React.Component<NotificationListProps, NotificationListState> {
    public constructor(props: NotificationListProps) {
        super(props);
        this.state = {
            showList: false
        };
    }

    public onRenderHeader = (): JSX.Element => {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="notification-list-header">
                        <h2>{context.t(ResourceKeys.header.notifications.panel.title)}</h2>

                        {this.props.notifications.length > 0 &&
                            <div className="commands">
                                <Link onClick={this.props.dismissNotifications}>{context.t(ResourceKeys.header.notifications.dismiss)}</Link>
                            </div>
                        }

                        <hr className="notification-list-divider" />
                    </div>
               )}
            </LocalizationContextConsumer>
        );
    }
    public render(): JSX.Element {
        const {showList} = this.state;
        const { notifications, hasNew } = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        <ActionButton
                            id="notifications"
                            iconProps={
                                {
                                    className: hasNew && 'new-notifications',
                                    iconName: 'Ringer'
                                }
                            }
                            onClick={this.onToggleDisplay}
                            text={context.t(ResourceKeys.header.notifications.show)}
                            ariaLabel={context.t(showList ?
                                ResourceKeys.header.notifications.hide :
                                ResourceKeys.header.notifications.show)}
                        />

                        <Panel
                            isOpen={showList}
                            type={PanelType.smallFixedFar}
                            isBlocking={true}
                            onRenderHeader={this.onRenderHeader}
                            onDismiss={this.onCloseDisplay}
                            closeButtonAriaLabel={context.t(ResourceKeys.common.close)}
                        >
                            <div>
                                {notifications.length === 0 &&
                                    <div>{context.t(ResourceKeys.header.notifications.panel.noNotifications)}</div>
                                }

                                {notifications.map((notification, index) => {
                                        return (
                                            <div key={index}>
                                                <NotificationListEntry notification={notification} />
                                                <hr className="notification-list-divider" />
                                            </div>);
                                    })
                                }

                            </div>
                        </Panel>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public onCloseDisplay = () => {
        this.setState({
            showList: false
        });
    }

    public onToggleDisplay = () => {
        if (!this.state.showList) {
            this.props.markAllNotificationsAsRead();
        }
        this.setState({
            showList: !this.state.showList
        });
    }
}
