import axios from "axios";

import { setMessages } from "./messages";
import {
    setLikesOtherPost,
    setRecent,
    editSinglePost,
    removeSinglePost
} from "./posts";

export const addPost = post => ({
    type: "ADD_POST",
    post
});

export const startAddPost = post => {
    return async dispatch => {
        try {
            let { data: newPost } = await axios.post("/api/post/", {
                ...post
            });
            dispatch(addPost(newPost));
            dispatch(setRecent(newPost));
            dispatch(
                setMessages({
                    errorMessage: "",
                    successMessage: "Post created with success!"
                })
            );
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

export const setPosts = posts => ({
    type: "SET_MY_POSTS",
    posts
});

export const editPost = (id, updates) => ({
    type: "EDIT_POST",
    id,
    updates
});

export const startEditPost = (id, updates) => {
    return async dispatch => {
        try {
            let { data: newPost } = await axios.patch(
                `/api/post/${id}`,
                updates
            );
            dispatch(editPost(id, newPost));
            dispatch(editSinglePost(id, newPost));
            dispatch(
                setMessages({
                    errorMessage: "",
                    successMessage: "Post updated with success!"
                })
            );
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

export const removePost = id => ({
    type: "REMOVE_POST",
    id
});

export const startRemovePost = id => {
    return async dispatch => {
        try {
            await axios.delete(`/api/post/${id}`);
            dispatch(removePost(id));
            dispatch(removeSinglePost(id));
            dispatch(
                setMessages({
                    errorMessage: "",
                    successMessage: "Post removed with success!"
                })
            );
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

export const setLikes = (id, likes) => ({
    type: "SET_LIKES",
    id,
    likes
});

export const startLikePost = id => {
    return async dispatch => {
        try {
            let { data: likes } = await axios.patch(`/api/post/like/${id}`);
            dispatch(setLikes(id, likes));
            dispatch(setLikesOtherPost(id, likes));
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

export const appendPosts = posts => ({
    type: "APPEND_POSTS",
    posts
});

export const startAppendPosts = (id, skip) => {
    return async dispatch => {
        try {
            let { data: posts } = await axios.get(
                `/api/post/?skip=${skip}&userid=${id}`
            );
            dispatch(appendPosts(posts));
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
