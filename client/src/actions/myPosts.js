import axios from "axios";
import { setMessages } from "./messages";

export const addPost = post => ({
    type: "ADD_POST",
    post
});

export const startAddPost = post => {
    return async dispatch => {
        try {
            await axios.post("/api/post/", {
                ...post
            });
            dispatch(addPost(post));
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
