import React from "react";
import { connect } from "react-redux";

import Posts from "./Posts";
import {
    startSetPosts,
    startAppendLatestPosts,
    startAppendMostRatedPosts
} from "../actions/posts";

export class DashboardPage extends React.Component {
    state = {
        latest: true,
        loading: false
    };

    componentDidMount() {
        if (!this.props.requested) {
            this.setState(
                () => ({
                    loading: true
                }),
                () => {
                    this.props
                        .setPosts()
                        .then(() => this.setState(() => ({ loading: false })));
                }
            );
        }
    }

    onMostRatedClick = () =>
        this.setState(() => ({
            latest: false
        }));

    onLatestClick = () => this.setState(() => ({ latest: true }));

    onLoadMoreClick = () => {
        if (this.state.latest) {
            this.props.appendLatestPosts(this.props.latestPosts.length);
        } else {
            this.props.appendMostRatedPosts(this.props.mostRatedPosts.length);
        }
    };

    render() {
        return (
            <div className="container">
                <section className="articles">
                    <section className="hero is-info is-bold is-small promo-block">
                        <div className="hero-body">
                            <div className="container">
                                <h1 className="title">
                                    <i className="fas fa-bullhorn mg-right-small" />
                                    Latest posts
                                </h1>
                                <h2 className="subtitle">
                                    See the most recent posts created by the
                                    users
                                </h2>
                            </div>
                        </div>
                    </section>
                </section>
                <div className="tabs is-centered is-boxed">
                    <ul>
                        <li
                            className={this.state.latest ? "is-active" : ""}
                            onClick={this.onLatestClick}
                        >
                            <a>
                                <span className="icon is-small">
                                    <i className="fas fa-calendar-alt" />
                                </span>
                                <span>Latest Posts</span>
                            </a>
                        </li>
                        <li
                            className={!this.state.latest ? "is-active" : ""}
                            onClick={this.onMostRatedClick}
                        >
                            <a>
                                <span className="icon is-small">
                                    <i className="fas fa-thumbs-up" />
                                </span>
                                <span>Most Rated Posts</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <Posts
                    posts={
                        this.state.latest
                            ? this.props.latestPosts
                            : this.props.mostRatedPosts
                    }
                />
                {this.state.loading && (
                    <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                )}
                {this.state.latest &&
                    !this.props.latestInfoMessage &&
                    this.props.latestPosts.length > 0 && (
                        <div className="has-text-centered">
                            <button
                                className="button is-info is-rounded is-medium"
                                onClick={this.onLoadMoreClick}
                            >
                                Load more
                            </button>
                        </div>
                    )}
                {this.props.latestInfoMessage &&
                    this.state.latest && (
                        <div className="notification is-info">
                            {this.props.latestInfoMessage}
                        </div>
                    )}

                {!this.state.latest &&
                    !this.props.mostRatedInfoMessage &&
                    this.props.mostRatedPosts.length > 0 && (
                        <div className="has-text-centered">
                            <button
                                className="button is-info is-rounded is-medium"
                                onClick={this.onLoadMoreClick}
                            >
                                Load more
                            </button>
                        </div>
                    )}

                {this.props.mostRatedInfoMessage &&
                    !this.state.latest && (
                        <div className="notification is-info">
                            {this.props.mostRatedInfoMessage}
                        </div>
                    )}
            </div>
        );
    }
}

const mapStatToProps = state => ({
    latestPosts: state.posts.latestPosts,
    mostRatedPosts: state.posts.mostRatedPosts,
    requested: state.posts.requested,
    latestInfoMessage: state.posts.latestPostsInfo,
    mostRatedInfoMessage: state.posts.mostRatedPostsInfo
});

const mapDispatchToProps = dispatch => ({
    setPosts: () => dispatch(startSetPosts()),
    appendLatestPosts: skip => dispatch(startAppendLatestPosts(skip)),
    appendMostRatedPosts: skip => dispatch(startAppendMostRatedPosts(skip))
});

export default connect(mapStatToProps, mapDispatchToProps)(DashboardPage);
