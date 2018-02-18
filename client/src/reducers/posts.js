const postsDefaultState = {
    latestPosts: [],
    mostRatedPosts: [],
    requested: false
};
export default (state = postsDefaultState, action) => {
    switch (action.type) {
        case "SET_POSTS":
            return {
                requested: true,
                latestPosts: action.latestPosts,
                mostRatedPosts: action.mostRatedPosts
            };
        case "APPEND_LATEST":
            return {
                ...state,
                latestPosts: [...state.latestPosts, ...action.posts]
            };
        case "APPEND_RATED":
            return {
                ...state,
                mostRatedPosts: [...state.mostRatedPosts, ...action.posts]
            };
        case "SET_LIKES_OTHER":
            return {
                ...state,
                mostRatedPosts: state.mostRatedPosts.map(
                    post =>
                        post._id !== action.id
                            ? post
                            : { ...post, likes: action.likes }
                ),
                latestPosts: state.mostRatedPosts.map(
                    post =>
                        post._id !== action.id
                            ? post
                            : { ...post, likes: action.likes }
                )
            };
        default:
            return state;
    }
};
