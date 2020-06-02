/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
// Please refer to https://github.com/mozilla-services/react-jsonschema-form/blob/master/docs/advanced-customization.md#custom-component-registration
import { FabricCheckbox } from './widgets/checkBox';
import { FabricSelect } from './widgets/select';
import { FabricDatePicker } from './widgets/datePicker';

export const fabricWidgets = {
    CheckboxWidget: FabricCheckbox,
    DateWidget: FabricDatePicker,
    SelectWidget: FabricSelect,
    // TextWidget: FabricText, // State change and office fabric text field onChange is causing an extra rerender. Commenting it out for now
  };

import { ArrayFieldTemplate } from './fields/arrayFieldTemplate';
import { FieldTemplate } from './fields/fieldTemplate';

export const fabricFields = {
    ArrayFieldTemplate,
    FieldTemplate
};
