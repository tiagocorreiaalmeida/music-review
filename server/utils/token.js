/*
-----------------------------
Based on AdelMahjoub solution
-----------------------------
*/

import https from 'https';
import queryString from 'querystring';
import { appCache } from "../app";

function getOrRefreshToken() {
    return new Promise((resolve, reject) => {
        let token = appCache.get('SPOTIFY_ACCESS_TOKEN');
        if (!token) {
            updateToken().then(newToken => {
                //ACCESS TOKEN REFRESHED
                resolve(newToken);
            }).catch((e) => reject(e));
        } else {
            //ACCESS TOKEN FROM CACHE
            resolve(token);
        }
    });
}

function updateToken() {
    return new Promise((resolve, reject) => {
        getAccessToken().then(tokenData => {
            appCache.set('SPOTIFY_ACCESS_TOKEN', tokenData.access_token, tokenData.expires_in);
            resolve(appCache.get('SPOTIFY_ACCESS_TOKEN'));
        }).catch((e) => reject(e));
    });
}

function getAccessToken() {

    const authHeader = `Basic ${Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_KEY}`).toString('base64')}`;
    const requestBody = queryString.stringify({ 'grant_type': 'client_credentials' });
    const options = {
        hostname: 'accounts.spotify.com',
        method: 'POST',
        path: '/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(requestBody),
            'Authorization': authHeader
        }
    }

    return new Promise((resolve, reject) => {
        const authRequest = https.request(options, res => {
            let data = '';
            res.on('error', (err) => { reject(err.message) });
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => { resolve(JSON.parse(data)) });
        });

        authRequest.on('error', (err) => { reject(err.message) });
        authRequest.write(requestBody);
        authRequest.end();
    });
}

export default getOrRefreshToken;