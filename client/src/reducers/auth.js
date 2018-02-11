export default (state = {}, action) => {
    switch (action.type) {
        case "login":
            return action.userData;
        case "logout":
            return {};
        default:
            return state;
    }
};
