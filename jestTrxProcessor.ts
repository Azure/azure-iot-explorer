/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
const Builder = require("jest-trx-results-processor");

const processor = Builder({
    outputFile: "jest-test-results.trx",
});

module.exports = processor;
