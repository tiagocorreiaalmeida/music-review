import React from "react";

export default class PostForm extends React.Component {
    state = {
        search: "",
        title: "",
        review: "",
        artists: [],
        albumName: "",
        albumLink: ""
    };

    onTitleChange = e => {
        let title = e.target.value;
        this.setState(() => ({ title }));
    };

    onReviewChange = e => {
        let review = e.target.value;
        this.setState(() => ({ review }));
    };

    onSubmit = e => {
        e.preventDefault();
    };

    onSearchChange = e => {
        let search = e.target.value;
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
                                    value={this.state.albumLink}
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
