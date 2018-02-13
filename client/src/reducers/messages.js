const messagesDefaultState = {
    errorMessage: "",
    successMessage: ""
};
export default (state = messagesDefaultState, action) => {
    switch (action.type) {
        case "SET_MESSAGES": {
            return {
                ...state,
                ...action.messages
            };
        }
        case "SET_DEFAULT": {
            return messagesDefaultState;
        }
        default:
            return state;
    }
};
