import * as React from 'react';
import { ModelRepositoryContextProvider } from '../../modelRepository/context/modelRepositoryStateContext';
import { useModelRepositoryState } from '../../modelRepository/hooks/useModelRepositoryState';
import { NotificationsContextProvider } from '../../../notifications/context/notificationsStateContext';
import { useNotificationState } from '../../../notifications/hooks/useNotificationsState';
import { BreadcrumbContext } from '../../../navigation/hooks/useBreadcrumbContext';
import { useBreadcrumbs } from '../../../navigation/hooks/useBreadcrumbs';

export const GlobalContextProvider: React.FC = props => {
    return (
        <ModelRepositoryContextProvider value={useModelRepositoryState()}>
            <NotificationsContextProvider value={useNotificationState()}>
                <BreadcrumbContext.Provider value={useBreadcrumbs()}>
                    {props.children}
                </BreadcrumbContext.Provider>
            </NotificationsContextProvider>
        </ModelRepositoryContextProvider>
    );
};
