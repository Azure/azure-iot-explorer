/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as GithubService from './githubService';
describe('githubService', () => {

    context('fetchLatestReleaseTagName', () => {
        it('calls fetch with no parameters', () => {
            GithubService.fetchLatestReleaseTagName();
            expect(fetch).toBeCalledWith(GithubService.latestReleaseApiPath);
        });

        it('returns tag name when response is 200', async () => {
            // tslint:disable
            const releaseInfo = {
                'url': 'https://api.github.com/repos/Azure/azure-iot-explorer/releases/20791117',
                'assets_url': 'https://api.github.com/repos/Azure/azure-iot-explorer/releases/20791117/assets',
                'upload_url': 'https://uploads.github.com/repos/Azure/azure-iot-explorer/releases/20791117/assets{?name,label}',
                'html_url': 'https://github.com/Azure/azure-iot-explorer/releases/tag/v0.10.6',
                'id': 20791117,
                'node_id': 'MDc6UmVsZWFzZTIwNzkxMTE3',
                'tag_name': 'v0.10.6',
                'target_commitish': '0dfff276ad1da3fd33453be1e1b28dc0687c3ff8',
                'name': 'Version 0.10.6',
                'draft': false,
                'author': {},
                'prerelease': false,
                'created_at': '2019-10-17T22:57:52Z',
                'published_at': '2019-10-17T23:52:03Z',
                'assets': [],
                'tarball_url': 'https://api.github.com/repos/Azure/azure-iot-explorer/tarball/v0.10.6',
                'zipball_url': 'https://api.github.com/repos/Azure/azure-iot-explorer/zipball/v0.10.6',
                'body': '## Changes:balabala\r\n\r\n'
            };
            const response = {
                json: () => releaseInfo,
                headers: {},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await GithubService.fetchLatestReleaseTagName();
            expect(result).toEqual('v0.10.6');
        });

        it('returns tag name as undefined when response is not 200', async () => {
            // tslint:disable
            const response = {
                ok: false,
                statusText: 'Not found'
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await GithubService.fetchLatestReleaseTagName();
            expect(result).toEqual(undefined);
        });
    });
});
