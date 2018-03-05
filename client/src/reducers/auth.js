export default (state = {}, action) => {
    switch (action.type) {
        case "login":
            return action.user;
        case "logout":
            return {};
        case "update_data":
            return {
                ...state,
                ...action.updates
            }
        default:
            return state;
    }
};
