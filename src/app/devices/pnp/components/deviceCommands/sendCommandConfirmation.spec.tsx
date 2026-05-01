/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@fluentui/react-components';
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
         wrapper.find(Button).at(1).props().onClick(undefined);
 
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
         wrapper.find(Button).at(0).props().onClick(undefined);
 
         expect(onSendConfirm).toHaveBeenCalled();
     });
 });
 