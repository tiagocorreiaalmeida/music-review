const navbarDefaultState = {
    burgerIsActive: false,
    modalIsActive: false
};

export default (state = navbarDefaultState, action) => {
    switch (action.type) {
        case "UPDATE_NAVBAR": {
            return {
                ...state,
                ...action.updates
            };
        }
        default:
            return state;
    }
};
