import React from "react";
import axios from "axios";

export default class PostForm extends React.Component {
    state = {
        search: "",
        title: "",
        review: "",
        artists: [],
        error: "",
        albumName: "",
        albumLink: "",
        albumCover: "",
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
            this.state.timer = setTimeout(() => {
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
            }, 500);
        } else {
            this.setState(() => ({ searchResults: [] }));
        }
    };

    onAlbumClick = albumPostion => {
        let { name, link, cover, artists } = this.state.searchResults[
            albumPostion
        ];
        this.setState(() => ({
            albumName: name,
            albumLink: link,
            albumCover: cover,
            artists: [...artists],
            searching: false
        }));
    };

    onSubmit = e => {
        e.preventDefault();

        if (this.props.post) {
            //edit post
        } else {
            //new post
        }
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
                                        this.state.searching &&
                                        this.state.searchResults.length > 0
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
                                                        {ele.name}
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
                        <button className="button is-primary is-size-5 has-text-weight-bold">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
