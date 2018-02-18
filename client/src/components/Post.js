import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

import { startLikePost } from "../actions/myPosts";
import { startLikeOtherPost } from "../actions/posts";

export class Post extends React.Component {
    onLikeClick = () => {
        if (!this.props.author) {
            this.props.likeOther(this.props.post._id);
        } else {
            this.props.like(this.props.post._id);
        }
    };

    render() {
        return (
            <div className={`column ${this.props.author ? "is-4" : "is-6"}`}>
                <div className="card article">
                    <div className="card-content">
                        <div className="media">
                            {!this.props.author && (
                                <div className="media-center">
                                    <img
                                        src="http://www.radfaces.com/images/avatars/daria-morgendorffer.jpg"
                                        className="author-image"
                                        alt="User avatar"
                                    />
                                </div>
                            )}
                            <div
                                className={`media-content has-text-centered ${this
                                    .props.author && "no-margin"}`}
                            >
                                <Link to="/">
                                    <p className="title article-title">
                                        {this.props.post.title}
                                    </p>
                                </Link>
                                <p className="subtitle is-6 article-subtitle">
                                    <a href="/userpage">
                                        @{this.props.post.author.username}
                                    </a>
                                    , on
                                    {moment(
                                        Number(this.props.post.createdAt)
                                    ).format(" Do MMMM YYYY")}
                                </p>
                                <img
                                    src={this.props.post.albumCover}
                                    className="article-cover"
                                    alt="album cover"
                                />
                            </div>
                        </div>

                        <div className="content article-body">
                            <p className="review">
                                {this.props.post.review.length > 256
                                    ? this.props.post.review.slice(0, 253) +
                                      "..."
                                    : this.props.post.review}
                            </p>
                            <button
                                className="button is-primary is-size-5 has-text-weight-bold"
                                onClick={this.onLikeClick}
                            >
                                {this.props.post.likes.length}
                                <i className="fas fa-thumbs-up mg-left-small" />
                            </button>
                            <Link
                                to={
                                    this.props.author
                                        ? `/edit/${this.props.post._id}`
                                        : "/"
                                }
                                className="button is-info is-size-5 has-text-weight-bold mg-left-small"
                            >
                                <p>
                                    <i
                                        className={
                                            this.props.author
                                                ? "fas fa-pencil-alt"
                                                : "fas fa-link"
                                        }
                                    />
                                    {this.props.author ? "Edit" : "See more"}
                                </p>
                            </Link>
                            {this.props.post.likes.includes(
                                this.props.userID
                            ) && (
                                <p className="has-text-grey mg-top-small">
                                    <i className="fas fa-check" /> You liked
                                    this post.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userID: state.auth._id,
    errorMessage: state.messages.errorMessage
});

const mapDispatchToProps = dispatch => ({
    like: id => dispatch(startLikePost(id)),
    likeOther: id => dispatch(startLikeOtherPost(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
