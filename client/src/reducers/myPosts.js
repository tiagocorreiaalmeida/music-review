export default (state = [], action) => {
    switch (action.type) {
        case "ADD_POST":
            return [...state, action.post];
        case "SET_POSTS":
            return [...action.posts];
        case "EDIT_POST":
            return state.myPosts.map(
                post =>
                    post.id !== action.id
                        ? post
                        : { ...post, ...action.updates }
            );
        case "REMOVE_POST":
            return state.myPosts.filter(post => post._id !== action.id);
        default:
            return state;
    }
};
