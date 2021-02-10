"use strict";
exports.__esModule = true;
/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
var electron_1 = require("electron");
var constants_1 = require("./constants");
exports.generateMenu = function (params) {
    var template = [
        exports.generateFileMenu(params),
        exports.generateEditMenu(params),
        exports.generateViewMenu(params),
        exports.generateWindowMenu(params),
        exports.generateHelpMenu(params)
    ];
    var menu = electron_1.Menu.buildFromTemplate(template);
    return menu;
};
exports.generateFileMenu = function (_a) {
    var platform = _a.platform;
    return {
        label: '&File',
        submenu: [
            platform === constants_1.PLATFORMS.MAC ? { role: 'quit' } : { role: 'close' }
        ]
    };
};
exports.generateEditMenu = function (params) {
    return {
        label: '&Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
        ]
    };
};
exports.generateViewMenu = function (params) {
    return {
        label: '&View',
        submenu: [
            { role: 'reload' },
            { type: 'separator' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    };
};
exports.generateWindowMenu = function (_a) {
    var platform = _a.platform;
    return {
        label: '&Window',
        submenu: platform === constants_1.PLATFORMS.MAC ? [
            { role: 'minimize' },
            { role: 'hide' },
            { role: 'close' }
        ] : [
            { role: 'minimize' },
            { role: 'close' }
        ]
    };
};
exports.generateHelpMenu = function (params) {
    return {
        label: '&Help',
        submenu: [
            {
                accelerator: 'CommandOrControl+Shift+I',
                click: function (menuItem, browserWindow, event) {
                    browserWindow.webContents.toggleDevTools();
                },
                label: 'Toggle Developer Tools'
            },
            { type: 'separator' },
            {
                click: function () {
                    var version = electron_1.app.getVersion();
                    if (!!version) {
                        electron_1.shell.openExternal("https://github.com/Azure/azure-iot-explorer/releases/tag/v" + version);
                    }
                    else {
                        electron_1.shell.openExternal("https://github.com/Azure/azure-iot-explorer/releases");
                    }
                },
                role: 'about'
            }
        ]
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OzREQUc0RDtBQUM1RCxxQ0FBaUc7QUFDakcseUNBQXdDO0FBTTNCLFFBQUEsWUFBWSxHQUFHLFVBQUMsTUFBOEI7SUFDdkQsSUFBTSxRQUFRLEdBQWlDO1FBQzNDLHdCQUFnQixDQUFDLE1BQU0sQ0FBQztRQUN4Qix3QkFBZ0IsQ0FBQyxNQUFNLENBQUM7UUFDeEIsd0JBQWdCLENBQUMsTUFBTSxDQUFDO1FBQ3hCLDBCQUFrQixDQUFDLE1BQU0sQ0FBQztRQUMxQix3QkFBZ0IsQ0FBQyxNQUFNLENBQUM7S0FDM0IsQ0FBQztJQUVGLElBQU0sSUFBSSxHQUFHLGVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHLFVBQUMsRUFBb0M7UUFBbEMsc0JBQVE7SUFDdkMsT0FBTztRQUNILEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFO1lBQ0wsUUFBUSxLQUFLLHFCQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1NBQ3BFO0tBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVXLFFBQUEsZ0JBQWdCLEdBQUcsVUFBQyxNQUE4QjtJQUMzRCxPQUFPO1FBQ0gsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUU7WUFDTCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDaEIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ2hCLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDZixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDaEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pCLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtTQUN4QjtLQUNKLENBQUM7QUFDTixDQUFDLENBQUE7QUFFWSxRQUFBLGdCQUFnQixHQUFHLFVBQUMsTUFBOEI7SUFDM0QsT0FBTztRQUNILEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFO1lBQ0wsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDbEIsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ25CLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyQixFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtTQUMvQjtLQUNKLENBQUM7QUFDTixDQUFDLENBQUE7QUFFWSxRQUFBLGtCQUFrQixHQUFHLFVBQUMsRUFBa0M7UUFBakMsc0JBQVE7SUFDeEMsT0FBTztRQUNILEtBQUssRUFBRSxTQUFTO1FBQ2hCLE9BQU8sRUFBRSxRQUFRLEtBQUsscUJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDaEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1NBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0EsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUNwQjtLQUNKLENBQUM7QUFDTixDQUFDLENBQUE7QUFFWSxRQUFBLGdCQUFnQixHQUFHLFVBQUMsTUFBOEI7SUFDM0QsT0FBTztRQUNILEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksV0FBVyxFQUFFLDBCQUEwQjtnQkFDdkMsS0FBSyxFQUFFLFVBQUMsUUFBa0IsRUFBRSxhQUE0QixFQUFFLEtBQVk7b0JBQ2xFLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQy9DLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLHdCQUF3QjthQUNsQztZQUNELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyQjtnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsSUFBTSxPQUFPLEdBQUcsY0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNqQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7d0JBQ2YsZ0JBQUssQ0FBQyxZQUFZLENBQUMsK0RBQTZELE9BQVMsQ0FBQyxDQUFDO3FCQUMxRjt5QkFBTTt3QkFDQyxnQkFBSyxDQUFDLFlBQVksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO3FCQUNsRjtnQkFDTCxDQUFDO2dCQUNELElBQUksRUFBRSxPQUFPO2FBQ2hCO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQyxDQUFBIn0=