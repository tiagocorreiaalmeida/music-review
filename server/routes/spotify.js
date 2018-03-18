import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

import auth from "../utils/auth";
import getOrRefreshToken from "../utils/token";

const router = express.Router(),
    spotifyApi = new SpotifyWebApi();

router.get(/(.+)/, auth, async (req, res) => {
    let albumName = req.params[0];
    try {

        const token = await getOrRefreshToken();
        spotifyApi.setAccessToken(token);

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