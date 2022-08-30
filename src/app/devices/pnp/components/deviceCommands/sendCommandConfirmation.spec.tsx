/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { PrimaryButton, DefaultButton } from '@fluentui/react';
import { SendCommandConfirmation, SendCommandConfirmationProps } from './sendCommandConfirmation';
 
 describe('SendCommandConfirmation', () => {
     it('matches snapshot hidden', () => {
         const props: SendCommandConfirmationProps = {
             hidden: true,
             onSendCancel: jest.fn(),
             onSendConfirm: jest.fn(),
         };
 
         const wrapper = shallow(<SendCommandConfirmation {...props}/>);
         expect(wrapper).toMatchSnapshot();
     });
     it('matches snapshot visible', () => {
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel: jest.fn(),
            onSendConfirm: jest.fn(),
        };
 
         const wrapper = shallow(<SendCommandConfirmation {...props}/>);
         expect(wrapper).toMatchSnapshot();
     });
 
     it('calls onSendCancel when Cancel clicked', () => {
         const onSendCancel = jest.fn();
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel,
            onSendConfirm: jest.fn(),
        };
 
         const wrapper = shallow(<SendCommandConfirmation {...props}/>);
         wrapper.find(DefaultButton).props().onClick(undefined);
 
         expect(onSendCancel).toHaveBeenCalled();
     });
 
     it('calls onDeleteConfirm when Confirm clicked', () => {
         const onSendConfirm = jest.fn();
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel: jest.fn(),
            onSendConfirm,
        };
 
         const wrapper = shallow(<SendCommandConfirmation {...props}/>);
         wrapper.find(PrimaryButton).props().onClick(undefined);
 
         expect(onSendConfirm).toHaveBeenCalled();
     });
 });
 