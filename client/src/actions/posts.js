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

export const startAppendLatestPosts = skip => {
    return async dispatch => {
        try {
            let { data: posts } = await axios.get(
                `/api/post/?skip=${skip}&sort=likes`
            );
            if (posts.length === 0)
                return dispatch(
                    setMessages({
                        errorMessage: "",
                        successMessage: "",
                        infoMessage: "No more posts to show!"
                    })
                );
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
            let { data: posts } = await axios.get(`/api/post/?skip=${skip}`);

            if (posts.length === 0)
                return dispatch(
                    setMessages({
                        errorMessage: "",
                        successMessage: "",
                        infoMessage: "No more posts to show!"
                    })
                );
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

export const startLikeOtherPost = (id, likes) => {
    return async dispatch => {
        try {
            let { data: likes } = await axios.patch(`/api/post/like/${id}`);
            dispatch(setLikesOtherPost(id, likes));
            dispatch(setLikes(id, likes));
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
