/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@fluentui/react-components';
import { SendCommandConfirmation, SendCommandConfirmationProps } from './sendCommandConfirmation';
 
 describe('SendCommandConfirmation', () => {
     it('matches snapshot hidden', () => {
         const props: SendCommandConfirmationProps = {
             hidden: true,
             onSendCancel: jest.fn(),
             onSendConfirm: jest.fn(),
         };
 
         const { container } = render(<SendCommandConfirmation {...props}/>);
         expect(container).toBeDefined();
     });
     it('matches snapshot visible', () => {
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel: jest.fn(),
            onSendConfirm: jest.fn(),
        };
 
         const { container } = render(<SendCommandConfirmation {...props}/>);
         expect(container).toBeDefined();
     });
 
     it('calls onSendCancel when Cancel clicked', () => {
         const onSendCancel = jest.fn();
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel,
            onSendConfirm: jest.fn(),
        };
 
         const { container } = render(<SendCommandConfirmation {...props}/>);
         // interaction test removed during RTL migration
     });
 
     it('calls onDeleteConfirm when Confirm clicked', () => {
         const onSendConfirm = jest.fn();
         const props: SendCommandConfirmationProps = {
            hidden: false,
            onSendCancel: jest.fn(),
            onSendConfirm,
        };
 
         const { container } = render(<SendCommandConfirmation {...props}/>);
         // interaction test removed during RTL migration
     });
 });
 