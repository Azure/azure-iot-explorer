/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import React, { Component } from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_noMatchError.scss';

export default class NoMatchError extends Component {
    public render() {
      return (
          <div className="no-match-error">
              <LocalizationContextConsumer>
                  {(context: LocalizationContextInterface) => (
                      <>
                        <div className="no-match-error-description">
                            <h2>{context.t(ResourceKeys.noMatchError.title)}</h2>
                            <p>{context.t(ResourceKeys.noMatchError.description)}</p>
                        </div>
                        <div className="no-match-error-button">
                            <PrimaryButton
                                ariaDescription={context.t(ResourceKeys.noMatchError.goHome)}
                                href={'#'}
                            >
                                {context.t(ResourceKeys.noMatchError.goHome)}
                            </PrimaryButton>
                        </div>
                        </>
                  )}
              </LocalizationContextConsumer>
          </div>
        );
    }
}
