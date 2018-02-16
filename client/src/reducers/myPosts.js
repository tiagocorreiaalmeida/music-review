export default (state = [], action) => {
    switch (action.type) {
        case "ADD_POST":
            return [...state, action.post];
        case "SET_POSTS":
            return [...action.posts];
        case "EDIT_POST":
            return state.map(
                post => (post._id !== action.id ? post : action.updates)
            );
        case "REMOVE_POST":
            return state.filter(post => post._id !== action.id);
        default:
            return state;
    }
};
