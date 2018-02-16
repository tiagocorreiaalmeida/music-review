import axios from "axios";
import { setMessages } from "./messages";

export const addPost = post => ({
    type: "ADD_POST",
    post
});

export const startAddPost = post => {
    return async dispatch => {
        try {
            let response = await axios.post("/api/post/", {
                ...post
            });
            dispatch(addPost(response.data));
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
    type: "SET_POSTS",
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
            let post = await axios.patch(`/api/post/${id}`, updates);
            dispatch(editPost(id, post.data));
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
