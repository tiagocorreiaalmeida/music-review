import React from "react";
import { connect } from "react-redux";

import { startAppendPosts } from "../actions/myPosts";
import Posts from "./Posts";

export class MyPostsPage extends React.Component {
    state = {
        loading: false,
        info: ""
    };

    onLoadMoreClick = () => {
        let length = this.props.posts.length;
        this.setState(
            () => ({
                loading: true
            }),
            () => {
                this.props.appendPosts(this.props.userID, length).then(() =>
                    this.setState(() => ({
                        loading: false,
                        info:
                            length === this.props.posts.length
                                ? "All your posts are allready loaded!"
                                : ""
                    }))
                );
            }
        );
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
                {this.state.info && (
                    <div className="notification is-info">
                        {this.state.info}
                    </div>
                )}
                {!this.state.info &&
                    this.props.posts.length > 0 && (
                        <div className="has-text-centered">
                            <button
                                className="button is-info is-rounded is-medium"
                                onClick={this.onLoadMoreClick}
                            >
                                Load more
                            </button>
                        </div>
                    )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.myPosts,
    userID: state.auth._id
});

const mapDispatchToProps = dispatch => ({
    appendPosts: (id, skip) => dispatch(startAppendPosts(id, skip))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPostsPage);
