/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { parseISO, format } from 'date-fns';

export const parseDateTimeString = (dateTimeString: string): string => {

    if (!dateTimeString || dateTimeString === '') {
        return null;
    }

    if (isNaN(Date.parse(dateTimeString))) {
        return null;
    }

    if (dateTimeString.match('0001-01-01.*')) {
        return null;
    }

    return format(parseISO(dateTimeString), 'h:mm:ss a, MM/dd/yyyy').toString();
};
