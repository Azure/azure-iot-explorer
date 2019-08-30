/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as moment from 'moment';

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

    return moment.utc(dateTimeString).local().format('h:mm:ss A, MMMM DD, YYYY');
};
