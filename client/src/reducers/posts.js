const postsDefaultState = {
    latestPosts: [],
    mostRatedPosts: [],
    requested: false,
    mostRatedPostsInfo: "",
    latestPostsInfo: ""
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
        case "EDIT_SINGLE_POST":
            return {
                ...state,
                mostRatedPosts: state.mostRatedPosts.map(
                    post =>
                        post._id !== action.id
                            ? post
                            : { ...post, ...action.post }
                ),
                latestPosts: state.mostRatedPosts.map(
                    post =>
                        post._id !== action.id
                            ? post
                            : { ...post, ...action.post }
                )
            };
        case "REMOVE_SINGLE_POST":
            return {
                ...state,
                mostRatedPosts: state.mostRatedPosts.filter(
                    post => post._id !== action.id
                ),
                latestPosts: state.latestPosts.filter(
                    post => post._id !== action.id
                )
            };
        case "SET_RECENT":
            return {
                ...state,
                latestPosts: [action.post, ...state.latestPosts]
            };
        case "SET_MOST_RATED_POSTS_INFO":
            return {
                ...state,
                mostRatedPostsInfo: action.info
            };
        case "SET_LATEST_POSTS_INFO":
            return {
                ...state,
                latestPostsInfo: action.info
            };
        default:
            return state;
    }
};
