import axios from "axios";

import { setMessages } from "./messages";
import { setLikes } from "./myPosts";

export const setPosts = (latestPosts, mostRatedPosts) => ({
    type: "SET_POSTS",
    latestPosts,
    mostRatedPosts
});

export const startSetPosts = () => {
    return async dispatch => {
        let latestPosts, mostRatedPosts;
        try {
            latestPosts = await axios.get("/api/post/");
            mostRatedPosts = await axios.get("/api/post/?sort=likes");
        } catch (e) {
            dispatch(
                setMessages({
                    errorMessage: e.response.data.error,
                    successMessage: ""
                })
            );
        } finally {
            dispatch(setPosts(latestPosts.data, mostRatedPosts.data));
        }
    };
};

export const appendLatestPosts = posts => ({
    type: "APPEND_LATEST",
    posts
});

export const setLatestPostsInfo = info => ({
    type: "SET_LATEST_POSTS_INFO",
    info
});

export const setMostRatedPostsInfo = info => ({
    type: "SET_MOST_RATED_POSTS_INFO",
    info
});

const displayInfo = (dispatch, type) => {
    if (type === "latest") {
        dispatch(setLatestPostsInfo("All existent posts are displayed!"));
    } else {
        dispatch(setMostRatedPostsInfo("All existent posts are displayed!"));
    }
};

export const startAppendLatestPosts = skip => {
    return async dispatch => {
        try {
            let { data: posts } = await axios.get(`/api/post/?skip=${skip}`);

            if (posts.length === 0) return displayInfo(dispatch, "latest");
            if (posts.length < 4) displayInfo(dispatch, "latest");

            dispatch(appendLatestPosts(posts));
        } catch (e) {
            dispatch(
                setMessages({
                    errorMessage: e.response.data.error,
                    successMessage: ""
                })
            );
        }
    };
};

export const appendMostRatedPosts = posts => ({
    type: "APPEND_RATED",
    posts
});

export const startAppendMostRatedPosts = skip => {
    return async dispatch => {
        try {
            let { data: posts } = await axios.get(
                `/api/post/?skip=${skip}&sort=likes`
            );

            if (posts.length === 0) return displayInfo(dispatch, "rated");
            if (posts.length < 4) displayInfo(dispatch, "rated");

            dispatch(appendMostRatedPosts(posts));
        } catch (e) {
            dispatch(
                setMessages({
                    errorMessage: e.response.data.error,
                    successMessage: ""
                })
            );
        }
    };
};

export const setLikesOtherPost = (id, likes) => ({
    type: "SET_LIKES_OTHER",
    likes,
    id
});


export const setRecent = post => ({
    type: "SET_RECENT",
    post
});

export const editSinglePost = (id, post) => ({
    type: "EDIT_SINGLE_POST",
    id,
    post
});

export const removeSinglePost = (id, post) => ({
    type: "REMOVE_SINGLE_POST",
    id,
    post
});
