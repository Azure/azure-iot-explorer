/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/components/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, REMOVE, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { SasTokenGenerationView } from '../../../shared/components/sasTokenGenerationView';
import { ModuleIdentityDetailHeader } from '../../shared/components/moduleIdentityDetailHeader';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { moduleIdentityDetailReducer } from '../reducer';
import { moduleIdentityDetailSaga } from '../saga';
import { moduleIdentityDetailStateInterfaceInitial } from '../state';
import { deleteModuleIdentityAction, getModuleIdentityAction } from '../actions';
import { useIotHubContext } from '../../../../iotHub/hooks/useIotHubContext';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

export const ModuleIdentityDetail: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const { hostName } = useIotHubContext();
    const history = useHistory();
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(moduleIdentityDetailReducer, moduleIdentityDetailSaga, moduleIdentityDetailStateInterfaceInitial(), 'moduleIdentityDetailState');
    const synchronizationStatus = localState.synchronizationStatus;
    const moduleIdentity = localState.payload;
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = React.useState<boolean>(false);
    const isDeleted = synchronizationStatus === SynchronizationStatus.deleted;
    const isFetching = synchronizationStatus === SynchronizationStatus.working;
    const isUpdating = synchronizationStatus === SynchronizationStatus.updating;

    React.useEffect(() => {
        retrieveData();
    },              []);

    React.useEffect(() => {
        if (isDeleted) {
            navigateToModuleList();
        }
    },              [isDeleted]);

    const retrieveData = () => dispatch(getModuleIdentityAction.started({ deviceId, moduleId }));

    const onDelete = () =>  {
        dispatch(deleteModuleIdentityAction.started({
            deviceId,
            moduleId
        }));
        closeDeleteDialog();
    };

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        disabled: isFetching || isUpdating,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        onClick: retrieveData
                    },
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.delete),
                        disabled: isFetching || isUpdating,
                        iconProps: {iconName: REMOVE},
                        key: REMOVE,
                        name: t(ResourceKeys.moduleIdentity.detail.command.delete),
                        onClick: deleteConfirmation
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

    const showModuleId = () => {
        return (
            <MaskedCopyableTextField
                ariaLabel={t(ResourceKeys.moduleIdentity.moduleId)}
                label={t(ResourceKeys.moduleIdentity.moduleId)}
                value={moduleId}
                allowMask={false}
                readOnly={true}
                labelCallout={t(ResourceKeys.moduleIdentity.moduleIdTooltip)}
            />
        );
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const showModuleIdentity = () => {
        const authType = (moduleIdentity && moduleIdentity.authentication && moduleIdentity.authentication.type || DeviceAuthenticationType.None).toLowerCase();

        switch (authType) {
            case DeviceAuthenticationType.SymmetricKey.toLowerCase():
                return renderSymmetricKeySection();
            case DeviceAuthenticationType.CACertificate.toLowerCase():
                return renderCaSection();
            case DeviceAuthenticationType.SelfSigned.toLowerCase():
                return renderSelfSignedSection();
            default:
                return (<></>);
        }
    };

    const renderSymmetricKeySection = () => {
        return (
            <>
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={moduleIdentity.authentication.symmetricKey.primaryKey}
                    allowMask={true}
                    readOnly={true}
                    labelCallout={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />

                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={moduleIdentity.authentication.symmetricKey.secondaryKey}
                    allowMask={true}
                    readOnly={true}
                    labelCallout={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />

                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                    value={generateConnectionString(moduleIdentity.authentication.symmetricKey.primaryKey)}
                    allowMask={true}
                    readOnly={true}
                />

                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                    value={generateConnectionString(moduleIdentity.authentication.symmetricKey.secondaryKey)}
                    allowMask={true}
                    readOnly={true}
                />

                {renderSasTokenSection()}
            </>
        );
    };

    const renderCaSection = () => <Label>{t(ResourceKeys.moduleIdentity.authenticationType.ca.text)}</Label>;

    const renderSelfSignedSection = () => {
        return (
            <>
                <Label>{t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.text)}</Label>
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={moduleIdentity.authentication.x509Thumbprint.primaryThumbprint}
                    allowMask={true}
                    readOnly={true}
                    labelCallout={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={moduleIdentity.authentication.x509Thumbprint.secondaryThumbprint}
                    allowMask={true}
                    readOnly={true}
                    labelCallout={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                />
            </>
        );
    };

    const renderSasTokenSection = () => {
        return (
            <SasTokenGenerationView
                activeAzureResourceHostName={hostName}
                moduleIdentity={moduleIdentity}
            />
        );
    };

    const navigateToModuleList = () => {
        const path = pathname.replace(/\/moduleIdentity\/moduleDetail\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    const generateConnectionString = (key: string): string => {
        return `HostName=${hostName};DeviceId=${deviceId};ModuleId=${moduleId};SharedAccessKey=${key}`;
    };

    const deleteConfirmationDialog = () => {
        return (
            <div role="dialog">
                <Dialog
                    hidden={!showDeleteConfirmation}
                    onDismiss={closeDeleteDialog}
                    dialogContentProps={{
                        title: t(ResourceKeys.moduleIdentity.detail.deleteConfirmation),
                        type: DialogType.close,
                    }}
                    modalProps={{
                        isBlocking: true,
                    }}
                >
                    <DialogFooter>
                        <PrimaryButton onClick={onDelete} text={t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.confirm)} />
                        <DefaultButton onClick={closeDeleteDialog} text={t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.cancel)} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    };

    const deleteConfirmation = () => setShowDeleteConfirmation(true);

    const closeDeleteDialog = () => setShowDeleteConfirmation(false);

    return (
        <>
            {showCommandBar()}
            <Route component={ModuleIdentityDetailHeader} />
            <div className="module-identity-detail">
                {showModuleId()}
                {isFetching ?
                    <MultiLineShimmer/> :
                    showModuleIdentity()
                }
                {showDeleteConfirmation && deleteConfirmationDialog()}
            </div>
        </>
    );
};
