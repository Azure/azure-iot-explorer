/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../shared/redux/state';
import { getNotificationsSelector, hasNewNotificationsSelector } from '../selectors';
import { clearNotificationsAction, markAllNotificationsAsReadAction } from '../actions';
import { NotificationListProps, NotificationList } from './notificationList';

const mapStateToProps = (state: StateType): Partial<NotificationListProps> => {
    return {
        hasNew: hasNewNotificationsSelector(state),
        notifications: getNotificationsSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Partial<NotificationListProps> => {
    return {
        dismissNotifications: () => dispatch(clearNotificationsAction()),
        markAllNotificationsAsRead: () => dispatch(markAllNotificationsAsReadAction())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
