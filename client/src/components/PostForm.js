import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setMessages } from "../actions/messages";
import { startAddPost } from "../actions/myPosts";

export class PostForm extends React.Component {
    state = {
        search: "",
        title: this.props.post ? this.props.post.title : "",
        review: this.props.post ? this.props.post.review : "",
        artists: this.props.post ? this.props.post.artists : [],
        albumName: this.props.post ? this.props.post.albumName : "",
        albumLink: this.props.post ? this.props.post.albumLink : "",
        albumCover: this.props.post ? this.props.post.albumCover : "",
        timer: false,
        searching: false,
        searchResults: [],
        searchError: ""
    };

    onTitleChange = e => {
        let title = e.target.value;
        this.setState(() => ({ title }));
    };

    onReviewChange = e => {
        let review = e.target.value;
        this.setState(() => ({ review }));
    };

    onSearchChange = e => {
        let search = e.target.value;
        this.setState(() => ({
            search,
            searching: true,
            searchError: "",
            searchResults: []
        }));
        if (this.state.timer !== false) clearTimeout(this.state.timer);
        if (search !== "") {
            this.setState(() => ({
                timer: setTimeout(() => {
                    axios
                        .get(`/api/spotify/${search}`)
                        .then(response => {
                            this.setState(() => ({
                                searchResults: [...response.data]
                            }));
                        })
                        .catch(e =>
                            this.setState(() => ({
                                searchError: e.response.data.error
                            }))
                        );
                    this.setState(() => ({ timer: false }));
                }, 500)
            }));
        } else {
            this.setState(() => ({ searchResults: [] }));
        }
    };

    onAlbumClick = albumPostion => {
        let {
            albumName,
            albumLink,
            albumCover,
            artists
        } = this.state.searchResults[albumPostion];
        this.setState(() => ({
            albumName,
            albumLink,
            albumCover,
            artists: [...artists],
            searching: false
        }));
    };

    onSubmit = e => {
        e.preventDefault();
        let error;

        if (
            !this.state.title.trim() ||
            !this.state.review ||
            !this.state.albumName
        ) {
            error = "Fill all the inputs before submit!";
        } else if (this.state.title.trim().length < 3) {
            error = "The title minimum length is 3 characters!";
        } else if (this.state.review.trim().length < 100) {
            error = "The review minimum length is 100 characters!";
        }

        if (error)
            return this.props.setMessages({
                successMessage: "",
                errorMessage: error
            });

        this.props.onSubmit({
            title: this.state.title,
            review: this.state.review,
            albumName: this.state.albumName,
            albumLink: this.state.albumLink,
            albumCover: this.state.albumCover,
            artists: [...this.state.artists]
        });
    };

    render() {
        return (
            <div className="card article">
                <div className="section">
                    <form onSubmit={this.onSubmit}>
                        <div className="field">
                            <div className="control">
                                <label className="label">
                                    Search the album by name
                                </label>
                                <input
                                    className="input is-primary"
                                    type="text"
                                    placeholder="Primary input"
                                    onChange={this.onSearchChange}
                                />
                                <div
                                    className={
                                        this.state.searching
                                            ? "popover popover--active"
                                            : "popover"
                                    }
                                >
                                    {this.state.searchError ? (
                                        <p className="popover__item is-size-5">
                                            {this.state.searchError}
                                        </p>
                                    ) : (
                                        this.state.searchResults.map(
                                            (ele, i) => {
                                                return (
                                                    <a
                                                        className="popover__item is-size-5"
                                                        key={i}
                                                        onClick={() =>
                                                            this.onAlbumClick(i)
                                                        }
                                                    >
                                                        <img
                                                            className="popover__item__thumbnail"
                                                            alt="album thumbnail"
                                                            src={ele.thumbnail}
                                                        />{" "}
                                                        {ele.albumName}
                                                    </a>
                                                );
                                            }
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="label">Album name</label>
                                <input
                                    className="input is-primary"
                                    type="text"
                                    placeholder="Primary input"
                                    value={this.state.albumName}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="label">Album link</label>
                                <input
                                    className="input is-primary"
                                    type="text"
                                    placeholder="Primary input"
                                    value={this.state.albumLink}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="label">Artists</label>
                                <input
                                    className="input is-primary"
                                    type="text"
                                    placeholder="Primary input"
                                    value={this.state.artists.reduce(
                                        (a, b) => a + "," + b.name,
                                        ""
                                    )}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="label">Title</label>
                                <input
                                    className="input is-primary"
                                    type="text"
                                    placeholder="Primary input"
                                    value={this.state.title}
                                    onChange={this.onTitleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="label">Review</label>
                                <textarea
                                    className="textarea is-primary"
                                    type="text"
                                    placeholder="Tell us what do you think about the album"
                                    value={this.state.review}
                                    onChange={this.onReviewChange}
                                />
                            </div>
                        </div>
                        {this.props.errorMessage && (
                            <p className="notification is-danger">
                                {this.props.errorMessage}
                            </p>
                        )}

                        {this.props.successMessage && (
                            <p className="notification is-success">
                                {this.props.successMessage}
                            </p>
                        )}

                        <button className="button is-primary is-size-5 has-text-weight-bold">
                            {this.props.post ? "Save changes" : "Create"}
                        </button>
                        {this.props.onRemove && (
                            <button
                                className="button is-danger is-size-5 has-text-weight-bold"
                                onClick={this.props.onRemove}
                            >
                                Delete
                            </button>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    errorMessage: state.messages.errorMessage,
    successMessage: state.messages.successMessage
});

const mapDispatchToProps = dispatch => ({
    setMessages: messages => dispatch(setMessages(messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
