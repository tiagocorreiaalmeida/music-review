import React from "react";

import Logo from "../images/logo_footer.png";

export default () =>
    (<footer className="footer">
        <div className="container has-text-centered">
            <img src={Logo} className="logo-img" alt="logo" />
            <p className="autor mg-top-small">Developed by Tiago Correia - 2018</p>
            <div className="social">
                <a href="https://github.com/tiagocorreiaalmeida" target="_blank" className="social__link"><i className="fab fa-github social__link__icon"></i></a>
                <a href="https://www.linkedin.com/in/tiago-correia-072417116/" target="_blank" className="social__link"><i className="fab fa-linkedin-in social__link__icon"></i></a>
                <a href="http://www.tiagoalmeidacorreia.pt" target="_blank" className="social__link"><i className="fas fa-suitcase social__link__icon"></i></a>
            </div>
        </div>
    </footer>);
