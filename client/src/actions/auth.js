import axios from "axios";

import { updateNavbar } from "./navbar";
import { setPosts } from "./myPosts";

export const login = user => ({
    type: "login",
    user
});

export const logout = () => ({
    type: "logout"
});

export const startLogin = user => {
    return async dispatch => {
        dispatch(login(user));
        console.log(typeof user);
        sessionStorage.setItem("auth", JSON.stringify(user));
        let posts = await axios.get(`/api/user/posts/${user.username}`);
        dispatch(setPosts(posts.data));
        sessionStorage.setItem("auth", user);
    };
};

export const startLogout = () => {
    return dispatch => {
        dispatch(logout());
        dispatch(setPosts([]));
        dispatch(
            updateNavbar({
                burgerIsActive: false,
                modalIsActive: false
            })
        );
        sessionStorage.clear();
    };
};

export const logBack = () => {
    return dispatch => {
        let user = sessionStorage.getItem("auth");
        if (user) {
            //start log back
        }
    };
};
