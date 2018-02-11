import { updateNavbar } from "./navbar";

export const login = userData => ({
    type: "login",
    userData
});

export const logout = () => ({
    type: "logout"
});

export const startLogin = userData => {
    return dispatch => {
        dispatch(login(userData));
        sessionStorage.setItem("auth", userData);
    };
};

export const startLogout = () => {
    return dispatch => {
        dispatch(logout());
        dispatch(
            updateNavbar({
                burgerIsActive: false,
                modalIsActive: false
            })
        );
        sessionStorage.clear();
    };
};
