import { updateNavbar } from "./navbar";
import { setPosts } from "./myPosts";

export const login = userData => ({
    type: "login",
    userData
});

export const logout = () => ({
    type: "logout"
});

export const startLogin = userData => {
    return dispatch => {
        dispatch(login(userData.user));
        dispatch(setPosts(userData.posts));
        sessionStorage.setItem("auth", userData.user);
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
