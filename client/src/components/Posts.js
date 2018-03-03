import React from "react";

import Post from "./Post";

export default props => (
    <div className="columns is-multiline" >
        {props.posts.map((post, i) => (
            <Post post={post} key={i} author={props.author} />
        ))}
    </div>
);
