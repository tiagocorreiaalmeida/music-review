import React from "react";

export default class ProfilePage extends React.Component {
    render() {
        return (
            <div className="container">
                <section className="hero is-primary is-bold is-small promo-block">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                <i class="fas fa-id-card" /> Your identification
                            </h1>
                            <h2 className="subtitle">
                                Make changes to your information
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
