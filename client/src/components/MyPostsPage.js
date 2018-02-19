import React from "react";
import { connect } from "react-redux";

import Posts from "./Posts";

export class MyPostsPage extends React.Component {
    state = {
        loading: false
    };
    render() {
        return (
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
                <Posts posts={this.props.posts} author={true} />
                {this.state.loading && (
                    <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.myPosts
});

export default connect(mapStateToProps)(MyPostsPage);
