export default (state = [], action) => {
    switch (action.type) {
        case "ADD_POST":
            return [action.post, ...state];
        case "SET_MY_POSTS":
            return [...action.posts];
        case "EDIT_POST":
            return state.map(
                post => (post._id !== action.id ? post : action.updates)
            );
        case "REMOVE_POST":
            return state.filter(post => post._id !== action.id);
        case "SET_LIKES":
            return state.map(
                post =>
                    post._id !== action.id
                        ? post
                        : { ...post, likes: action.likes }
            );
        case "APPEND_POSTS":
            return [...state, ...action.posts];
        default:
            return state;
    }
};
