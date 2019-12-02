import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MaskedCopyableTextField, MaskedCopyableTextFieldActionProps } from './maskedCopyableTextField';
import { addNotificationAction } from '../../notifications/actions';
import { Notification } from '../../api/models/notification';

const mapDispatchToProps = (dispatch: Dispatch): MaskedCopyableTextFieldActionProps => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
    };
};

export default connect(undefined, mapDispatchToProps, undefined, {
    pure: false,
})(MaskedCopyableTextField);
