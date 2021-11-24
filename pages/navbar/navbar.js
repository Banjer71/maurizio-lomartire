import React from "react";
import SocialMedia from "../social-media/index";
import LInkedin from "../../public/assets/linkedin.png";
import Fb from "../../public/assets/facebook.png";
import YouTube from "../../public/assets/video.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Maurizio Lomartire</h1>
      <ul className="nav-menu">
        <li>La vita</li>
        <li>Musica</li>
        <li>Foto</li>
        <li>Video</li>
        <li>Contatti</li>
      </ul>
      <div className="navbar-media">
        <SocialMedia icon1={Fb} icon2={LInkedin} icon3={YouTube} />
      </div>
    </div>
  );
};

export default Navbar;
