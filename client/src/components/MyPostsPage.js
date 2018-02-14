import React from "react";
import { connect } from "react-redux";

import Posts from "./Posts";

export const MyPostsPage = props => (
    <div className="container">
        <section className="hero is-danger is-bold is-small promo-block">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">
                        <i className="fas fa-list-ul mg-right-small" />
                        All your posts
                    </h1>
                    <h2 className="subtitle">
                        See and make changes to all your posts
                    </h2>
                </div>
            </div>
        </section>
        <Posts posts={props.posts} author={true} />
    </div>
);

const mapStateToProps = state => ({
    posts: state.myPosts
});

export default connect(mapStateToProps)(MyPostsPage);
