import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import Posts from "./Posts";

export class UserInfoPage extends React.Component {
    state = {
        user: {},
        latestPosts: [],
        mostRatedPosts: [],
        latest: true,
        mostRatedMessage: "",
        latestMessage: "",
        loading: true
    }
    componentDidMount = async () => {
        this.setState(() => ({ loading: false }))
        let user,
            latestPosts,
            mostRatedPosts;
        try {
            user = await axios.get(`/api/user/info/${this.props.username}`);
            latestPosts = await axios.get(`/api/post/?userid=${user.data._id}`);
            mostRatedPosts = await axios.get(`/api/post/?userid=${user.data._id}&sort=likes`);
        } catch (e) {
            this.props.history.push("/");
        } finally {
            this.setState(() => ({ user: user.data, latestPosts: [...latestPosts.data], mostRatedPosts: [...mostRatedPosts.data] }))
        }
    }


    onLoadMoreClick = async () => {
        this.setState(() => ({ loading: true }));
        try {
            if (this.state.latest) {
                let { data: posts } = await axios.get(`/api/post/?userid=${this.state.user._id}&skip=${this.state.latestPosts.length}`);
                if (posts.length === 0) return this.setState(() => ({ latestMessage: "All existent posts are displayed!" }));
                this.setState((prevState) => ({ latestPosts: [...prevState.latestPosts, ...posts] }))
            } else {
                let { data: posts } = await axios.get(`/api/post/?userid=${this.state.user._id}&skip=${this.state.mostRatedPosts.length}&sort=likes`);
                if (posts.length === 0) return this.setState(() => ({ mostRatedMessage: "All existent posts are displayed!" }));
                this.setState((prevState) => ({ mostRatedPosts: [...prevState.mostRatedPosts, ...posts] }))
            }
        } catch (e) {
            if (this.state.latest) return this.setState(() => ({ latestMessage: e.response.data.error }));
            this.setState(() => ({ mostRatedMessage: e.response.data.error }));
        } finally {
            this.setState(() => ({ loading: false }))
        }
    }

    onMostRatedClick = () => this.setState(() => ({ latest: false }));

    onLatestClick = () => this.setState(() => ({ latest: true }));

    render() {
        return (
            <div className="container">
                <section className="hero is-small is-white is-bold promo-block">
                    <div className="hero-body">
                        <figure className="image is-192x192 margin-auto">
                            {this.state.user.avatar && (<img src={"data:image/jpeg;base64," + this.state.user.avatar} className="rounded mg-bottom-small" alt="user avatar" />)}
                        </figure>
                        <p className="has-text-centered is-size-4 has-text-weight-bold has-text-grey-dark">{this.state.user.username}</p>
                        <p className="has-text-centered has-text-grey-light">Member since <i className="far fa-clock"></i> {moment(parseInt(this.state.user.createdAt, 10)).format(" Do MMMM YYYY")}</p>
                    </div>
                </section>
                <div className="tabs is-centered is-boxed bg-white">
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
                {this.state.latestPosts.length === 0 && this.state.mostRatedPosts.length === 0 ? (<p className="is-size-5 mg-top-small">The user doesn't have posts to show!</p>) : (<Posts
                    posts={
                        this.state.latest
                            ? this.state.latestPosts
                            : this.state.mostRatedPosts
                    }
                    profile={true}
                />)}
                {this.state.loading && (
                    <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                )}
                {this.state.latest &&
                    !this.state.latestMessage &&
                    this.state.latestPosts.length > 0 && (
                        <div className="has-text-centered">
                            <button
                                className="button is-info is-rounded is-medium"
                                onClick={this.onLoadMoreClick}
                            >
                                Load more
                        </button>
                        </div>
                    )}
                {this.state.latestMessage &&
                    this.state.latest && (
                        <div className="notification is-info">
                            <i className="fas fa-info-circle mg-right-tiny"></i>{this.state.latestMessage}
                        </div>
                    )}

                {!this.state.latest &&
                    !this.state.mostRatedMessage &&
                    this.state.mostRatedPosts.length > 0 && (
                        <div className="has-text-centered">
                            <button
                                className="button is-info is-rounded is-medium"
                                onClick={this.onLoadMoreClick}
                            >
                                Load more
                        </button>
                        </div>
                    )}

                {this.state.mostRatedMessage &&
                    !this.state.latest && (
                        <div className="notification is-info">
                            <i className="fas fa-info-circle mg-right-tiny"></i>{this.state.mostRatedMessage}
                        </div>
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    username: props.match.params.username
})

export default connect(mapStateToProps)(UserInfoPage);