import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

import auth from "../utils/auth";

const router = express.Router(),
    spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_KEY
    });

async function setSpotifyAccessToken() {
    try {
        let data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);
        triesCount = 0;
    } catch (e) {
        if (triesCount < 3) {
            spotifyApi.refreshAccessToken();
            return setSpotifyAccessToken();
        } else {
            console.log(e);
        }
    }
}

setSpotifyAccessToken();

router.get(/(.+)/, auth, async (req, res) => {
    let albumName = req.params[0];
    try {
        let apiResponse = await spotifyApi.searchAlbums(albumName, {
            limit: 3
        });
        if (apiResponse.body.albums.items.length == 0)
            return res.error(409, "No results found based on your search!");
        let dataClean = apiResponse.body.albums.items.map(ele => ({
            albumName: ele.name,
            albumLink: ele.external_urls.spotify,
            thumbnail: ele.images[2].url,
            albumCover: ele.images[0].url,
            artists: ele.artists.map(artist => ({
                name: artist.name,
                link: artist.external_urls.spotify
            }))
        }));
        res.send(dataClean);
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    }
});

export default router;
