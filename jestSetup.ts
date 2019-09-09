/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setIconOptions } from "office-ui-fabric-react/lib/Styling";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

global['Headers'] = () => {};
window.parent.fetch = jest.fn();

// suppress icon warnings.
setIconOptions({
  disableWarnings: true,
});

Enzyme.configure({ adapter: new Adapter() });
document.execCommand = jest.fn(); // maskedCopyableTextField

// fix for smooth-dnd invocation error in test
Object.defineProperty(global, 'Node', {
  value: {firstElementChild: jest.fn()}
});
