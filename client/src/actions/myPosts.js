import axios from "axios";
import { setMessages } from "./messages";

export const addPost = post => ({
    type: "ADD_POST",
    post
});

export const startAddPost = post => {
    return dispatch => {
        axios
            .post("/api/post/", {
                ...post
            })
            .then(response => {
                dispatch(addPost(post));
                dispatch(
                    setMessages({
                        errorMessage: "",
                        successMessage: "Post created with success!"
                    })
                );
                //timeout and redirect
            })
            .catch(e =>
                dispatch(
                    setMessages({
                        errorMessage: e.response.data.error,
                        successMessage: ""
                    })
                )
            );
    };
};
