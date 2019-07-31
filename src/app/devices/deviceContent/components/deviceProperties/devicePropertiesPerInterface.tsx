/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import DevicePropertiesPerInterfacePerProperty, { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
}

export default class DevicePropertiesPerInterface
    extends React.Component<DevicePropertiesDataProps, {}> {
    constructor(props: DevicePropertiesDataProps) {
        super(props);
    }

    public render(): JSX.Element {

        const { twinAndSchema } = this.props;
        const properties = twinAndSchema && twinAndSchema.map((item, indexInner) => (
                <DevicePropertiesPerInterfacePerProperty
                    key={indexInner}
                    {...item}
                />
            ));
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="pnp-detail-list">
                        <div className="list-header">
                            <span className="column-name">{context.t(ResourceKeys.deviceProperties.columns.name)}</span>
                            <span className="column-schema-sm">{context.t(ResourceKeys.deviceProperties.columns.schema)}</span>
                            <span className="column-unit">{context.t(ResourceKeys.deviceProperties.columns.unit)}</span>
                            <span className="column-value">{context.t(ResourceKeys.deviceProperties.columns.value)}</span>
                        </div>
                        <section role="list" className="list-content scrollable-lg">
                            {properties}
                        </section>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }
}
