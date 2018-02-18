import React from "react";
import { connect } from "react-redux";

import Posts from "./Posts";
import { startSetPosts } from "../actions/posts";

export class DashboardPage extends React.Component {
    state = {
        latest: true
    };

    onMostRatedClick = () =>
        this.setState(() => ({
            latest: false
        }));

    onLatestClick = () => this.setState(() => ({ latest: true }));

    componentWillMount() {
        if (!this.props.requested) {
            this.props.setPosts();
        }
    }
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
            </div>
        );
    }
}

const mapStatToProps = state => ({
    latestPosts: state.posts.latestPosts,
    mostRatedPosts: state.posts.mostRatedPosts,
    requested: state.posts.requested
});

const mapDispatchToProps = dispatch => ({
    setPosts: () => dispatch(startSetPosts())
});

export default connect(mapStatToProps, mapDispatchToProps)(DashboardPage);
